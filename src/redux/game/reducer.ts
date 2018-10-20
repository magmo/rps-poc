import { Channel } from 'fmg-core';
import { Reducer } from 'redux';
import BN from 'bn.js';

import * as actions from './actions';
import * as state from './state';
import { Position, Conclude, PostFundSetupA, Propose, Accept, Reveal, Result, Resting, calculateResult, PreFundSetupB, PreFundSetupA, PostFundSetupB } from '../../game-engine/positions';
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

const initialJointState = { gameState: {}, messageState: NULL_MESSAGE_STATE};

export const gameReducer: Reducer<JointState> = (jointState: JointState, action: actions.GameAction) => {
  jointState = jointState || initialJointState;

  // resign and opponent resigned are global actions can be applied to any  jointState
  // see if we have one of those first
  switch (action.type) {
    case actions.RESIGN:
      return resignationReducer(jointState);
    case actions.OPPONENT_RESIGNED:
      return opponentResignationReducer(jointState);
    case actions.ACCEPT_GAME:
    case actions.CONFIRM_GAME:
    case actions.CHOOSE_PLAY:
    case actions.PLAY_AGAIN:
    case actions.POSITION_RECEIVED:
    case actions.FUNDING_SUCCESS:
    case actions.WITHDRAWAL_SUCCESS:
    case actions.WITHDRAWAL_REQUEST:
      // these actions can only be applied to one or two jointStates
      // we call this a 'local' action
      jointState = localActionReducer(jointState, action);
      // if we have a saved position in the inbox, try to apply it
      jointState = attemptRetry(jointState);
    default:
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

function itsMyTurnNext(jointState: JointState) {
  const { gameState, messageState } = jointState;
  const extraState = messageState.actionToRetry ? 1 : 0;
  const nextTurnNum = gameState.turnNum + 1 + extraState;

  return nextTurnNum % 2 === gameState.player;
}

function resignationReducer(jointState: JointState) {
  const { name } = jointState.gameState;
  if (name === state.StateName.WaitToResign || name === state.StateName.WaitForResignationAcknowledgement) {
    return jointState;
  }

  let { messageState, gameState } = jointState;

  if (itsMyTurnNext(jointState)) {
    let position;
    if (messageState.actionToRetry) {
      position = messageState.actionToRetry.position;
    } else {
      position = gameState.latestPosition;
    }
    const { channel, turnNum, resolution: balances } = position;

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
  // let { messageState, gameState } = jointState;

  // // gameState = transitionToOpponentResigned(gameState);
  // messageState = addToOutbox(gameState.latestSendablePosition);

  // return { gameState, messageState };
  return jointState;
}

function localActionReducer(jointState: JointState, action: actions.LocalAction): JointState {
  const { messageState, gameState } = jointState;

  switch (gameState.name) {
    case state.StateName.WaitForGameConfirmationA:
      return waitForGameConfirmationAReducer(gameState, messageState, action);
    case state.StateName.ConfirmGameB:
      return confirmGameBReducer(gameState, messageState, action);
    case state.StateName.WaitForFunding:
      return waitForFundingReducer(gameState, messageState, action);
    case state.StateName.WaitForPostFundSetup:
      return waitForPostFundSetupReducer(gameState, messageState, action);
    case state.StateName.PickMove:
      return pickMoveReducer(gameState, messageState, action);
    case state.StateName.WaitForOpponentToPickMoveA:
      return waitForOpponentToPickMoveAReducer(gameState, messageState, action);
    case state.StateName.WaitForOpponentToPickMoveB:
      return waitForOpponentToPickMoveBReducer(gameState, messageState, action);
    case state.StateName.WaitForRevealB:
      return waitForRevealBReducer(gameState, messageState, action);
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
      throw new Error("Unreachable code");
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

function confirmGameBReducer(gameState: state.ConfirmGameB, messageState: MessageState, action: actions.GameAction) : JointState {
  if (action.type !== actions.CONFIRM_GAME) { return { gameState, messageState }; }

  const { channel, turnNum, resolution, stake } = (gameState.latestPosition as PreFundSetupA);
  const newPosition = new PreFundSetupB(channel, turnNum + 1, resolution, 1, stake);

  const newGameState: state.WaitForFunding = {
    ...state.baseProperties(gameState),
    name: state.StateName.WaitForFunding,
    turnNum: turnNum + 1,
    latestPosition: newPosition,
  };

  messageState = { ...messageState, opponentOutbox: newPosition, walletOutbox: 'FUNDING_REQUESTED' };

  return { gameState: newGameState, messageState };
}

function waitForFundingReducer(
  gameState: state.WaitForFunding, messageState: MessageState, action: actions.GameAction
): JointState {
  if (action.type !== actions.FUNDING_SUCCESS) {
    return { gameState, messageState };
  }

  const { libraryAddress, channelNonce, participants, turnNum, balances, roundBuyIn } = gameState;
  const postFundSetupA = new PostFundSetupA(
    new Channel(libraryAddress, channelNonce, participants),
    turnNum + 1,
    balances,
    0,
    roundBuyIn
  );
  const newGameState: state.WaitForPostFundSetup = {
    ...state.baseProperties(gameState),
    latestPosition: postFundSetupA,
    name: state.StateName.WaitForPostFundSetup,
    turnNum: turnNum + 1,
  };
  const newMessageState = { ...NULL_MESSAGE_STATE, opponentOutbox: postFundSetupA };
  return { gameState: newGameState, messageState: newMessageState };
}

function waitForPostFundSetupReducer(gameState: state.WaitForPostFundSetup, messageState: MessageState, action: actions.GameAction): JointState {
  if (action.type !== actions.POSITION_RECEIVED) {
    return { gameState, messageState };
  }

  let latestPosition;
  if (gameState.player === Player.PlayerA) {
    latestPosition = action.position;
  } else {
    const { channel, turnNum, resolution, stake } = (action.position as PostFundSetupA);
    latestPosition = new PostFundSetupB(channel, turnNum + 1, resolution, 1, stake);
    messageState = { ...messageState, opponentOutbox: latestPosition };
  }

  const newGameState: state.PickMove = {
    ...state.baseProperties(gameState),
    name: state.StateName.PickMove,
    latestPosition,
    turnNum: latestPosition.turnNum,
  };

  return { gameState: newGameState, messageState };
}

function pickMoveReducer(gameState: state.PickMove, messageState: MessageState, action: actions.GameAction): JointState {
  const { channel, turnNum, resolution: balances } = gameState.latestPosition;
  const roundBuyIn = gameState.roundBuyIn;

  if (gameState.player === Player.PlayerA) {
    if (action.type !== actions.CHOOSE_PLAY) { return { gameState, messageState }; }
    const salt = randomHex(64);
    const latestPosition = Propose.createWithPlayAndSalt(channel, turnNum + 1, balances, roundBuyIn, action.play, salt);

    const newGameStateA: state.WaitForOpponentToPickMoveA = {
      ...state.baseProperties(gameState),
      player: gameState.player,
      myMove: action.play,
      salt,
      latestPosition,
      turnNum: turnNum + 1,
      name: state.StateName.WaitForOpponentToPickMoveA,
    };
    messageState = { ...messageState, opponentOutbox: latestPosition };

    return { gameState: newGameStateA, messageState };
  } else {
    if (action.type === actions.POSITION_RECEIVED && action.position.constructor.name === 'Propose') {
      messageState = { ...messageState, actionToRetry: action };
      return { gameState, messageState };
    } else if (action.type === actions.CHOOSE_PLAY) {

      const newGameStateB: state.WaitForOpponentToPickMoveB = {
        ...state.baseProperties(gameState),
        player: gameState.player,
        myMove: action.play,
        turnNum,
        name: state.StateName.WaitForOpponentToPickMoveB,
      };

      return { gameState: newGameStateB, messageState };
    }
  }

  return { gameState, messageState };
}

function insufficientFunds(balances: [BN, BN], roundBuyIn: BN) {
  return balances[0].lt(roundBuyIn) || balances[1].lt(roundBuyIn);
}

function waitForOpponentToPickMoveAReducer(gameState: state.WaitForOpponentToPickMoveA, messageState: MessageState, action: actions.GameAction): JointState {
  if (action.type !== actions.POSITION_RECEIVED) {
    return { gameState, messageState };
  }

  const { libraryAddress, channelNonce, participants, roundBuyIn, turnNum, myMove, salt } = gameState;
  const { position: theirPosition } = action;
  if (!(theirPosition instanceof Accept)) {
    return { gameState, messageState };
  }
  const { bPlay: theirMove, resolution: balances } = theirPosition;
  const channel = new Channel(libraryAddress, channelNonce, participants);
  const result = calculateResult(myMove, theirMove);

  const newBalances = [balances[0], balances[1]] as [BN, BN];
  if (result === Result.YouWin) {
    newBalances[Player.PlayerA] = balances[Player.PlayerA].add(new BN(roundBuyIn.muln(2)));
    newBalances[Player.PlayerB] = balances[Player.PlayerB].sub(new BN(roundBuyIn.muln(2)));
  } else if (result === Result.Tie) {
    newBalances[Player.PlayerA] = balances[Player.PlayerA].add(new BN(roundBuyIn.muln(1)));
    newBalances[Player.PlayerB] = balances[Player.PlayerB].sub(new BN(roundBuyIn.muln(1)));
  }

  const nextPosition = new Reveal(channel, turnNum + 2, newBalances, roundBuyIn, theirMove, myMove, salt);

  let newGameState;
  if (insufficientFunds(newBalances, roundBuyIn)) {
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

function waitForOpponentToPickMoveBReducer(gameState: state.WaitForOpponentToPickMoveB, messageState: MessageState, action: actions.GameAction) {
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }

  const position = action.position;
  if (!(position instanceof Propose)) { return { gameState, messageState }; }

  const { channel, turnNum, resolution: balances, stake, preCommit } = (position as Propose);
  const bPlay = gameState.myMove;

  const newBalances: [BN, BN] = [balances[0].sub(stake), balances[1].add(stake)];
  const newPosition = new Accept(channel, turnNum + 1, newBalances, stake, preCommit, bPlay);

  const newGameState: state.WaitForRevealB = {
    ...state.baseProperties(gameState),
    name: state.StateName.WaitForRevealB,
    turnNum: turnNum + 1,
    myMove: bPlay,
    player: Player.PlayerB,
    balances: newBalances,
    latestPosition: newPosition,
  };

  messageState = { ...messageState, opponentOutbox: newPosition };

  return { gameState: newGameState, messageState };
}

function waitForRevealBReducer(gameState: state.WaitForRevealB, messageState: MessageState, action: actions.GameAction) {
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }

  if (!(action.position instanceof Reveal)) { return { gameState, messageState }; }
  const position = action.position as Reveal;

  const myMove = gameState.myMove;
  const theirMove = position.aPlay;
  const balances = position.resolution as [BN, BN]; // wallet will catch if they updated wrong
  const roundBuyIn = gameState.roundBuyIn;

  const result = calculateResult(myMove, theirMove);

  if (insufficientFunds(balances, roundBuyIn)) {
    const { channel, turnNum } = position;
    const newPosition = new Conclude(channel, turnNum + 1, balances);
    messageState = { ...messageState, opponentOutbox: newPosition };

    const newGameState1: state.InsufficientFunds = {
      ...state.baseProperties(gameState),
      name: state.StateName.InsufficientFunds,
      turnNum: turnNum + 1,
      latestPosition: newPosition,
      myMove,
      theirMove,
      player: Player.PlayerB,
      result,
      balances,
    };

    return { gameState: newGameState1, messageState };
  } else {
    const newGameState2: state.PlayAgain = {
      ...state.baseProperties(gameState),
      name: state.StateName.PlayAgain,
      turnNum: position.turnNum,
      latestPosition: position,
      myMove,
      theirMove,
      player: Player.PlayerA,
      result,
      balances,
    };

    return { gameState: newGameState2, messageState };
  }
}

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
        return { gameState: newGameState, messageState };
      } else {
        const { channel, turnNum, resolution: balances, stake } = gameState.latestPosition as Reveal;
        const resting = new Resting(channel, turnNum + 1, balances, stake);

        // send Resting
        messageState = { ...messageState, opponentOutbox: resting };

        // transition to PickMove
        const newGameState: state.PickMove = {
          ...state.baseProperties(gameState),
          name: state.StateName.PickMove,
          turnNum: turnNum + 1,
          latestPosition: resting,
        };

        return { gameState: newGameState, messageState };
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
    balances: position.resolution,
    latestPosition: position,
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
  } else {
    latestPosition = position;
  }

  // transition to gameOver
  const newGameState: state.GameOver = {
    ...state.baseProperties(gameState),
    name: state.StateName.GameOver,
    turnNum: latestPosition.turnNum,
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
    latestPosition: newPosition,
  };

  messageState = { ...messageState, opponentOutbox: newPosition };

  return { gameState: newGameState, messageState };
}

// function opponentResignedReducer(gameState: state.OpponentResigned, messageState: MessageState, action: actions.GameAction) {
// }

function waitForResignationAcknowledgementReducer(gameState: state.WaitForResignationAcknowledgement, messageState: MessageState, action: actions.GameAction) {
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }
  if (action.position.constructor.name !== 'Conclude') { return { gameState, messageState }; }

  const newGameState: state.GameOver = {
    ...state.baseProperties(gameState), 
    name: state.StateName.GameOver,
  };

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
