import { Channel } from 'fmg-core';
import { Reducer } from 'redux';
import BN from 'bn.js';

import * as actions from './actions';
import * as state from './state';
import { Position, Conclude, PostFundSetupA, Propose, Accept, Reveal, Result, Resting, calculateResult } from '../../game-engine/positions';
import { randomHex } from '../../utils/randomHex';
import { Player } from '../../game-engine/application-states';

export interface MessageState {
  opponentOutbox: Position | null;
  walletOutbox: string | null;
  actionToRetry: actions.PositionReceived | null;
}

const NULL_MESSAGE_STATE = { opponentOutbox: null, walletOutbox: null, actionToRetry: null };

export interface JointState {
  gameState: state.GameState;
  messageState: MessageState;
}

export const gameReducer: Reducer<JointState> = (jointState: JointState, action: actions.GameAction) => {
  // resign and opponent resigned are global actions can be applied to any  jointState
  // see if we have one of those first
  switch (action.type) {
    case actions.RESIGN:
      return resignationReducer(jointState);
    case actions.OPPONENT_RESIGNED:
      return opponentResignationReducer(jointState);
    default:
      // otherwise, we have an action can only be applied to one or two jointStates
      // we call this a 'local' action
      jointState = localActionReducer(jointState, action);
      // if we have a saved position in the inbox, try to apply it
      jointState = attemptRetry(jointState);

      return jointState;
  }
};

function attemptRetry(jointState: JointState): JointState {
  let { messageState } = jointState;
  const { gameState } = jointState;

  const actionToRetry = messageState.actionToRetry;
  if (actionToRetry) {
    messageState = { ...messageState, actionToRetry: null };
    jointState = localActionReducer({ gameState, messageState }, actionToRetry);
  }
  return jointState;
}

function resignationReducer(jointState: JointState) {
  let { messageState, gameState } = jointState;

  if (state.itsMyTurn(gameState)) {
    const { channel, turnNum, resolution: balances } = gameState.latestPosition;

    const conclude = new Conclude(channel, turnNum + 1, balances);

    // transition to WaitForResignationAcknowledgement
    gameState = {
      ...state.baseProperties(gameState),
      name: state.StateName.WaitForResignationAcknowledgement,
      turnNum: turnNum + 1,
      latestPosition: conclude,
    };
    // and send the latest state to our opponent
    messageState = { ...messageState, opponentOutbox: conclude };
  } else {
    // transition to WaitToResign
    gameState = { ...state.baseProperties(gameState), name: state.StateName.WaitToResign };
  }

  return { gameState, messageState };
}

function opponentResignationReducer(jointState: JointState) {
  let { messageState, gameState } = jointState;

  gameState = transitionToOpponentResigned(gameState);
  messageState = addToOutbox(gameState.latestSendablePosition);

  return { gameState, messageState };
}

function localActionReducer(jointState: JointState, action: actions.GameAction): JointState {
  const { messageState, gameState } = jointState;

  switch (gameState.name) {
    case state.StateName.WaitForGameConfirmationA:
      return waitForGameConfirmationAReducer(gameState, messageState, action);
    // case state.StateName.ConfirmGameB:
    //   return confirmGameBReducer(gameState, messageState, action);
    case state.StateName.WaitForFunding:
      return waitForFundingReducer(gameState, messageState, action);
    case state.StateName.WaitForPostFundSetup:
      return waitForPostFundSetupReducer(gameState, messageState, action);
    case state.StateName.PickMove:
      return pickMoveReducer(gameState, messageState, action);
    case state.StateName.WaitForOpponentToPickMoveA:
      return waitForOpponentToPickMoveAReducer(gameState, messageState, action);
    // case state.StateName.WaitForOpponentToPickMoveB:
    //   return waitForOpponentToPickMoveBReducer(gameState, messageState, action);
    // case state.StateName.WaitForRevealB:
    //   return waitForRevealBReducer(gameState, messageState, action);
    case state.StateName.PlayAgain:
      return playAgainReducer(gameState, messageState, action);
    case state.StateName.WaitForRestingA:
      return waitForRestingAReducer(gameState, messageState, action);
    case state.StateName.InsufficientFunds:
      return insufficientFundsReducer(gameState, messageState, action);
    case state.StateName.WaitToResign:
      return waitToResignReducer(gameState, messageState, action);
    // case state.StateName.OpponentResigned:
    //   return opponentResignedReducer(gameState, messageState, action);
    case state.StateName.WaitForResignationAcknowledgement:
      return waitForResignationAcknowledgementReducer(gameState, messageState, action);
    case state.StateName.GameOver:
      return gameOverReducer(gameState, messageState, action);
    // case state.StateName.WaitForWithdrawal:
    //   return waitForWithdrawalReducer(gameState, messageState, action);
    default:
      // should be unreachable
      return jointState;
  }
}

function waitForGameConfirmationAReducer(
  gameState: state.WaitForGameConfirmationA, messageState: MessageState, action: actions.GameAction
): JointState {
  // only action we need to handle in this state is to receiving a PreFundSetup
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }
  if (action.position.constructor.name !== 'PreFundSetup') { return { gameState, messageState }; }

  // request funding
  messageState = { ...messageState, walletOutbox: 'FUNDING_REQUESTED' };

  // transition to Wait for Funding
  const newGameState: state.WaitForFunding = { ...state.baseProperties(gameState), name: state.StateName.WaitForFunding };

  return { messageState, gameState: newGameState };
}

// function confirmGameBReducer(gameState: state.ConfirmGameB, messageState: MessageState, action: actions.GameAction) : JointState {
// }

function waitForFundingReducer(
  gameState: state.WaitForFunding, messageState: MessageState, action: actions.GameAction
): JointState {
  if (action.type !== actions.FUNDING_SUCCESS) {
    return { gameState, messageState };
  }

  const { libraryAddress, channelNonce, participants, turnNum, balances, roundBuyIn } = gameState;
  const postFundSetupA = new PostFundSetupA(
    new Channel(libraryAddress, channelNonce, participants),
    turnNum + 2,
    balances,
    0,
    roundBuyIn
  );
  const newGameState: state.WaitForPostFundSetup = {
    ...state.baseProperties(gameState),
    latestPosition: postFundSetupA,
    name: state.StateName.WaitForPostFundSetup,
  };
  const newMessageState = { ...NULL_MESSAGE_STATE, opponentOutbox: postFundSetupA };
  return { gameState: newGameState, messageState: newMessageState };
}

function waitForPostFundSetupReducer(gameState: state.WaitForPostFundSetup, messageState: MessageState, action: actions.GameAction): JointState {
  if (action.type !== actions.POSITION_RECEIVED) {
    return { gameState, messageState };
  }
  const newGameState: state.PickMove = { ...state.baseProperties(gameState), name: state.StateName.PickMove };

  return { gameState: newGameState, messageState: NULL_MESSAGE_STATE };
}

function pickMoveReducer(gameState: state.PickMove, messageState: MessageState, action: actions.GameAction): JointState {
  if (action.type !== actions.CHOOSE_PLAY) {
    return { gameState, messageState };
  }

  let newGameState: state.WaitForOpponentToPickMoveA | state.WaitForOpponentToPickMoveB;
  const { turnNum, balances, roundBuyIn, libraryAddress, channelNonce, participants } = gameState;
  const { play } = action;
  const channel = new Channel(libraryAddress, channelNonce, participants);
  if (gameState.player === Player.PlayerA) {
    const salt = randomHex(64);
    const latestPosition = Propose.createWithPlayAndSalt(channel, turnNum + 2, balances, roundBuyIn, play, salt)

    newGameState = {
      ...state.baseProperties(gameState),
      player: gameState.player,
      myMove: action.play,
      salt,
      latestPosition,
      name: state.StateName.WaitForOpponentToPickMoveA,
    };
    const newMessageState = { ...messageState, opponentOutbox: latestPosition };

    return { gameState: newGameState, messageState: newMessageState };
  } else {
    // const { preCommit } = gameState;
    // const latestPosition = new Accept(channel, turnNum, balances, roundBuyIn, preCommit, play);
    // newGameState = {
    //   ...state.baseProperties(gameState),
    //   player: gameState.player,
    //   myMove: action.play,
    //   name: state.StateName.WaitForOpponentToPickMoveB,
    // };
    return { gameState, messageState };
  }
}

function waitForOpponentToPickMoveAReducer(gameState: state.WaitForOpponentToPickMoveA, messageState: MessageState, action: actions.GameAction): JointState {
  if (action.type !== actions.POSITION_RECEIVED) {
    return { gameState, messageState};
  }

  const { libraryAddress, channelNonce, participants, roundBuyIn, turnNum, myMove, salt } = gameState;
  const { position: theirPosition } = action;
  if (!(theirPosition instanceof Accept)) {
    return { gameState, messageState };
  }
  const { bPlay: theirMove, resolution: balances } = theirPosition;
  const channel = new Channel(libraryAddress, channelNonce, participants);
  const result = calculateResult(myMove, theirMove);

  const newBalances = [balances[0], balances[1]];
  if (result === Result.YouWin) {
    newBalances[Player.PlayerA] = balances[Player.PlayerA].add(new BN(roundBuyIn.muln(2)));
    newBalances[Player.PlayerB] = balances[Player.PlayerB].sub(new BN(roundBuyIn.muln(2)));
  } else if (result === Result.Tie) {
    newBalances[Player.PlayerA] = balances[Player.PlayerA].add(new BN(roundBuyIn.muln(1)));
    newBalances[Player.PlayerB] = balances[Player.PlayerB].sub(new BN(roundBuyIn.muln(1)));
  }

  const nextPosition = new Reveal(channel, turnNum + 2, newBalances, roundBuyIn, theirMove, myMove, salt);

  let newGameState;
  if (newBalances[0] < roundBuyIn || newBalances[1] < roundBuyIn) {
    newGameState = {
      ...state.baseProperties(gameState), 
      name: state.StateName.InsufficientFunds,
      turnNum: turnNum + 2,
      latestPosition: nextPosition,
      myMove,
      theirMove,
      player: Player.PlayerA,
      result,
      balances: newBalances as [BN, BN],
    } as state.InsufficientFunds;
  } else {
    newGameState = {
      ...state.baseProperties(gameState), 
      name: state.StateName.PlayAgain,
      turnNum: turnNum + 2,
      latestPosition: nextPosition,
      myMove,
      theirMove,
      player: Player.PlayerA,
      result,
      balances: newBalances as [BN, BN],
    } as state.PlayAgain;
  }

  const newMessageState = { ...NULL_MESSAGE_STATE, opponentOutbox: nextPosition };

  return { gameState: newGameState, messageState: newMessageState };
}

// function waitForOpponentToPickMoveBReducer(gameState: state.WaitForOpponentToPickMoveB, messageState: MessageState, action: actions.GameAction) {
// }

// function waitForRevealBReducer(gameState: state.WaitForRevealB, messageState: MessageState, action: actions.GameAction) {
// }

function playAgainReducer(gameState: state.PlayAgain, messageState: MessageState, action: actions.GameAction) {
  switch (action.type) {
    // case actions.RESIGN: // handled globally
    // case actions.OPPONENT_RESIGNED: // handled globally
    case actions.PLAY_AGAIN:
      if (gameState.player === Player.PlayerA) {
        // transition to WaitForResting
        const { myMove, theirMove, result } = gameState;
        const newGameState: state.WaitForRestingA = {
          ...state.baseProperties(gameState),
          name: state.StateName.WaitForRestingA,
          myMove,
          theirMove,
          result,
          player: Player.PlayerA,
        };
        return { newGameState, messageState };
      } else {
        const { channel, turnNum, resolution: balances, stake } = gameState.latestPosition as Reveal;
        const resting = new Resting(channel, turnNum + 1, balances, stake);

        // send Resting
        messageState = { ...messageState, opponentOutbox: resting };

        // transition to PickMove
        const newGameState: state.PickMove = { 
          ...state.baseProperties(gameState),
          name: state.StateName.PickMove,
        };

        return { newGameState, messageState };
      }

    case actions.POSITION_RECEIVED:
      const position = action.position;
      if (position.constructor.name !== 'Resting') { return { gameState, messageState }; }

      messageState = { ...messageState, actionToRetry: action };
      return { gameState, messageState };

    default:
      return { gameState, messageState };

  }

}

function waitForRestingAReducer(gameState: state.WaitForRestingA, messageState: MessageState, action: actions.GameAction) {
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }

  const position = action.position;
  if (position.constructor.name !== 'Resting') { return { gameState, messageState }; }

  const newGameState: state.PickMove = {
    ...state.baseProperties(gameState),
    name: state.StateName.PickMove,
    turnNum: position.turnNum,
  };

  return { gameState: newGameState, messageState };
}

function insufficientFundsReducer(gameState: state.InsufficientFunds, messageState: MessageState, action: actions.GameAction) {
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }

  const position = action.position;
  if (position.constructor.name !== 'Conclude') { return { gameState, messageState }; }
  const { channel, turnNum, resolution: balances } = position;
  let latestPosition = gameState.latestPosition;

  if (gameState.player === Player.PlayerA) {
    // send conclude if player A

    const conclude = new Conclude(channel, turnNum + 1, balances);

    latestPosition = conclude;
    messageState = { ...messageState, opponentOutbox: conclude };
  }

  // transition to gameOver
  const newGameState: state.GameOver = {
    ...state.baseProperties(gameState),
    name: state.StateName.GameOver,
    turnNum: turnNum + 1,
    latestPosition,
  };

  return { gameState: newGameState, messageState };
}

function waitToResignReducer(gameState: state.WaitToResign, messageState: MessageState, action: actions.GameAction) {
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }
  const { channel, turnNum, resolution: balances } = action.position;

  const newPosition = new Conclude(channel, turnNum + 1, balances);

  const newGameState: state.WaitForResignationAcknowledgement = {
    ...state.baseProperties(gameState),
    name: state.StateName.WaitForResignationAcknowledgement,
    turnNum: turnNum + 1,
    balances,
  };

  messageState = { ...messageState, opponentOutbox: newPosition };

  return { gameState: newGameState, messageState };
}

// function opponentResignedReducer(gameState: state.OpponentResigned, messageState: MessageState, action: actions.GameAction) {
// }

function waitForResignationAcknowledgementReducer(gameState: state.WaitForResignationAcknowledgement, messageState: MessageState, action: actions.GameAction) {
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }
  if (action.position.constructor.name !== 'Conclude') { return { gameState, messageState }; }

  const newGameState: state.GameOver = { ...state.baseProperties(gameState), name: state.StateName.GameOver };

  return { gameState: newGameState, messageState };
}

function gameOverReducer(gameState: state.GameOver, messageState: MessageState, action: actions.GameAction) {
  if (action.type !== actions.WITHDRAWAL_REQUEST) { return { gameState, messageState }; }

  const newGameState: state.WaitForWithdrawal = { ...state.baseProperties(gameState), name: state.StateName.WaitForWithdrawal };
  messageState = { ...messageState, walletOutbox: 'WITHDRAWAL' };

  return { gameState: newGameState, messageState };
}

// function waitForWithdrawalReducer(gameState: state.WaitForWithdrawal, messageState: MessageState, action: actions.GameAction) {
// }
