import { Channel } from 'fmg-core';
import { Reducer } from 'redux';
import BN from 'bn.js';

import * as actions from './actions';
import * as states from './state';
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
  gameState: states.GameState;
  messageState: MessageState;
}

export class StartState {
  gameState: states.NotStarted;
  messageState: (typeof NULL_MESSAGE_STATE);
}

export type State = JointState | StartState;

const initialJointState: StartState = {
  gameState: {name: states.StateName.NotStarted},
  messageState: NULL_MESSAGE_STATE,
};

export const gameReducer: Reducer<State> = (state: State, action: actions.GameAction) => {
  state = state || initialJointState;

  // resign and opponent resigned are global actions can be applied to any state
  // see if we have one of those first
  switch (action.type) {
    case actions.ACCEPT_GAME:
      if (state.gameState.name !== states.StateName.NotStarted) {
        throw new Error(`invalid start state: ${state.gameState.name}`);
      }
      return acceptGameReducer(action);
    case actions.RESIGN:
      return resignationReducer(state as JointState);
    case actions.OPPONENT_RESIGNED:
      return opponentResignationReducer(state as JointState, action.position);
    case actions.CONFIRM_GAME:
    case actions.CHOOSE_PLAY:
    case actions.PLAY_AGAIN:
    case actions.POSITION_RECEIVED:
    case actions.FUNDING_SUCCESS:
    case actions.WITHDRAWAL_SUCCESS:
    case actions.WITHDRAWAL_REQUEST:
      // these actions can only be applied to one or two states
      // we call this a 'local' action
      state = localActionReducer(state as JointState, action);
      // if we have a saved position in the inbox, try to apply it
      state = attemptRetry(state);
    default:
      return state;
  }
};

function attemptRetry(state: JointState): JointState {
  let { messageState } = state;
  const { gameState } = state;

  const actionToRetry = messageState.actionToRetry;
  if (actionToRetry) {
    messageState = { ...messageState, actionToRetry: null };
    state = localActionReducer({ gameState, messageState }, actionToRetry);
  }
  return state;
}

function itsMyTurnNext(state: JointState) {
  const { gameState, messageState } = state;
  const extraState = messageState.actionToRetry ? 1 : 0;
  const nextTurnNum = gameState.turnNum + 1 + extraState;

  return nextTurnNum % 2 === gameState.player;
}

function acceptGameReducer(action: actions.AcceptGame): JointState {
  const player = Player.PlayerA;
  const {
    stake,
    myName,
    myAddress,
    opponentName,
    opponentAddress,
    libraryAddress,
    channelNonce,
  } = action;

  const balances: [BN, BN] = [(new BN(stake)).muln(5), (new BN(stake)).muln(5)];
  const participants: [string, string] = [myAddress, opponentAddress];
  const channel = new Channel(libraryAddress, channelNonce, participants);
  const turnNum = 0;
  const stateCount = 0;
  const preFundSetupA = new PreFundSetupA(channel, turnNum, balances, stateCount, stake);
  const newGameState: states.WaitForGameConfirmationA = {
    name: states.StateName.WaitForGameConfirmationA,
    player,
    turnNum,
    roundBuyIn: stake,
    balances,
    stateCount,
    myName,
    opponentName,
    latestPosition: preFundSetupA,
    libraryAddress,
    channelNonce,
    participants,
  };

  const messageState = { ...NULL_MESSAGE_STATE, opponentOutbox: preFundSetupA, };
  return { gameState: newGameState, messageState };
}

function resignationReducer(state: JointState): JointState {
  const { name } = state.gameState;
  if (name === states.StateName.WaitToResign || name === states.StateName.WaitForResignationAcknowledgement) {
    return state;
  }

  let { messageState, gameState } = state;

  if (itsMyTurnNext(state)) {
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
      ...states.base(gameState),
      name: states.StateName.WaitForResignationAcknowledgement,
      turnNum: turnNum + 1,
      latestPosition: conclude,
    };
    // and send the latest state to our opponent
    messageState = { ...messageState, opponentOutbox: conclude };
  } else {
    // transition to WaitToResign
    gameState = { ...states.base(gameState), name: states.StateName.WaitToResign };
  }

  return { gameState, messageState };
}

function opponentResignationReducer(state: JointState, position: Conclude) {
  let { messageState } = state;
  const { gameState } = state;

  // for the time being, we're just trusting it was their turn - which the
  // wallet will enforce
  const { channel, resolution, turnNum } = position;
  const newPosition = new Conclude(channel, turnNum + 1, resolution);

  messageState = { ...messageState, opponentOutbox: newPosition };
  const newGameState: states.OpponentResigned = {
    ...states.base(gameState),
    name: states.StateName.OpponentResigned,
    latestPosition: newPosition,
    turnNum: turnNum + 1,
  };

  return { gameState: newGameState, messageState };
}

function localActionReducer(state: JointState, action: actions.LocalAction): JointState {
  const { messageState, gameState } = state;

  switch (gameState.name) {
    case states.StateName.WaitForGameConfirmationA:
      return waitForGameConfirmationAReducer(gameState, messageState, action);
    case states.StateName.WaitForGameConfirmationA:
      return waitForGameConfirmationAReducer(gameState, messageState, action);
    case states.StateName.ConfirmGameB:
      return confirmGameBReducer(gameState, messageState, action);
    case states.StateName.WaitForFunding:
      return waitForFundingReducer(gameState, messageState, action);
    case states.StateName.WaitForPostFundSetup:
      return waitForPostFundSetupReducer(gameState, messageState, action);
    case states.StateName.PickMove:
      return pickMoveReducer(gameState, messageState, action);
    case states.StateName.WaitForOpponentToPickMoveA:
      return waitForOpponentToPickMoveAReducer(gameState, messageState, action);
    case states.StateName.WaitForOpponentToPickMoveB:
      return waitForOpponentToPickMoveBReducer(gameState, messageState, action);
    case states.StateName.WaitForRevealB:
      return waitForRevealBReducer(gameState, messageState, action);
    case states.StateName.PlayAgain:
      return playAgainReducer(gameState, messageState, action);
    case states.StateName.WaitForRestingA:
      return waitForRestingAReducer(gameState, messageState, action);
    case states.StateName.InsufficientFunds:
      return insufficientFundsReducer(gameState, messageState, action);
    case states.StateName.WaitToResign:
      return waitToResignReducer(gameState, messageState, action);
    // case states.StateName.OpponentResigned:
    //   return opponentResignedReducer(gameState, messageState, action);
    case states.StateName.WaitForResignationAcknowledgement:
      return waitForResignationAcknowledgementReducer(gameState, messageState, action);
    case states.StateName.GameOver:
      return gameOverReducer(gameState, messageState, action);
    // case states.StateName.WaitForWithdrawal:
    //   return waitForWithdrawalReducer(gameState, messageState, action);
    default:
      throw new Error("Unreachable code");
  }
}

function waitForGameConfirmationAReducer( gameState: states.WaitForGameConfirmationA, messageState: MessageState, action: actions.GameAction): JointState {
  // only action we need to handle in this state is to receiving a PreFundSetup
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }
  if (action.position.constructor.name !== 'PreFundSetup') { return { gameState, messageState }; }

  // request funding
  messageState = { ...messageState, walletOutbox: 'FUNDING_REQUESTED' };

  // transition to Wait for Funding
  const newGameState: states.WaitForFunding = { ...states.base(gameState), name: states.StateName.WaitForFunding };

  return { messageState, gameState: newGameState };
}

function confirmGameBReducer(gameState: states.ConfirmGameB, messageState: MessageState, action: actions.GameAction) : JointState {
  if (action.type !== actions.CONFIRM_GAME) { return { gameState, messageState }; }

  const { channel, turnNum, resolution, stake } = (gameState.latestPosition as PreFundSetupA);
  const newPosition = new PreFundSetupB(channel, turnNum + 1, resolution, 1, stake);

  const newGameState: states.WaitForFunding = {
    ...states.base(gameState),
    name: states.StateName.WaitForFunding,
    turnNum: turnNum + 1,
    latestPosition: newPosition,
  };

  messageState = { ...messageState, opponentOutbox: newPosition, walletOutbox: 'FUNDING_REQUESTED' };

  return { gameState: newGameState, messageState };
}

function waitForFundingReducer( gameState: states.WaitForFunding, messageState: MessageState, action: actions.GameAction): JointState {
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
  const newGameState: states.WaitForPostFundSetup = {
    ...states.base(gameState),
    latestPosition: postFundSetupA,
    name: states.StateName.WaitForPostFundSetup,
    turnNum: turnNum + 1,
  };
  const newMessageState = { ...NULL_MESSAGE_STATE, opponentOutbox: postFundSetupA };
  return { gameState: newGameState, messageState: newMessageState };
}

function waitForPostFundSetupReducer(gameState: states.WaitForPostFundSetup, messageState: MessageState, action: actions.GameAction): JointState {
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

  const newGameState: states.PickMove = {
    ...states.base(gameState),
    name: states.StateName.PickMove,
    latestPosition,
    turnNum: latestPosition.turnNum,
  };

  return { gameState: newGameState, messageState };
}

function pickMoveReducer(gameState: states.PickMove, messageState: MessageState, action: actions.GameAction): JointState {
  const { channel, turnNum, resolution: balances } = gameState.latestPosition;
  const roundBuyIn = gameState.roundBuyIn;

  if (gameState.player === Player.PlayerA) {
    if (action.type !== actions.CHOOSE_PLAY) { return { gameState, messageState }; }
    const salt = randomHex(64);
    const latestPosition = Propose.createWithPlayAndSalt(channel, turnNum + 1, balances, roundBuyIn, action.play, salt);

    const newGameStateA: states.WaitForOpponentToPickMoveA = {
      ...states.base(gameState),
      player: gameState.player,
      myMove: action.play,
      salt,
      latestPosition,
      turnNum: turnNum + 1,
      name: states.StateName.WaitForOpponentToPickMoveA,
    };
    messageState = { ...messageState, opponentOutbox: latestPosition };

    return { gameState: newGameStateA, messageState };
  } else {
    if (action.type === actions.POSITION_RECEIVED && action.position.constructor.name === 'Propose') {
      messageState = { ...messageState, actionToRetry: action };
      return { gameState, messageState };
    } else if (action.type === actions.CHOOSE_PLAY) {

      const newGameStateB: states.WaitForOpponentToPickMoveB = {
        ...states.base(gameState),
        player: gameState.player,
        myMove: action.play,
        turnNum,
        name: states.StateName.WaitForOpponentToPickMoveB,
      };

      return { gameState: newGameStateB, messageState };
    }
  }

  return { gameState, messageState };
}

function insufficientFunds(balances: [BN, BN], roundBuyIn: BN): boolean {
  return balances[0].lt(roundBuyIn) || balances[1].lt(roundBuyIn);
}

function waitForOpponentToPickMoveAReducer(gameState: states.WaitForOpponentToPickMoveA, messageState: MessageState, action: actions.GameAction): JointState {
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
      ...states.base(gameState),
      name: states.StateName.InsufficientFunds,
      turnNum: turnNum + 2,
      latestPosition: nextPosition,
      myMove,
      theirMove,
      player: Player.PlayerA,
      result,
      balances: newBalances as [BN, BN],
    } as states.InsufficientFunds;
  } else {
    newGameState = {
      ...states.base(gameState),
      name: states.StateName.PlayAgain,
      turnNum: turnNum + 2,
      latestPosition: nextPosition,
      myMove,
      theirMove,
      player: Player.PlayerA,
      result,
      balances: newBalances as [BN, BN],
    } as states.PlayAgain;
  }

  const newMessageState = { ...NULL_MESSAGE_STATE, opponentOutbox: nextPosition };

  return { gameState: newGameState, messageState: newMessageState };
}

function waitForOpponentToPickMoveBReducer(gameState: states.WaitForOpponentToPickMoveB, messageState: MessageState, action: actions.GameAction): JointState {
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }

  const position = action.position;
  if (!(position instanceof Propose)) { return { gameState, messageState }; }

  const { channel, turnNum, resolution: balances, stake, preCommit } = (position as Propose);
  const bPlay = gameState.myMove;

  const newBalances: [BN, BN] = [balances[0].sub(stake), balances[1].add(stake)];
  const newPosition = new Accept(channel, turnNum + 1, newBalances, stake, preCommit, bPlay);

  const newGameState: states.WaitForRevealB = {
    ...states.base(gameState),
    name: states.StateName.WaitForRevealB,
    turnNum: turnNum + 1,
    myMove: bPlay,
    player: Player.PlayerB,
    balances: newBalances,
    latestPosition: newPosition,
  };

  messageState = { ...messageState, opponentOutbox: newPosition };

  return { gameState: newGameState, messageState };
}

function waitForRevealBReducer(gameState: states.WaitForRevealB, messageState: MessageState, action: actions.GameAction): JointState {
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

    const newGameState1: states.InsufficientFunds = {
      ...states.base(gameState),
      name: states.StateName.InsufficientFunds,
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
    const newGameState2: states.PlayAgain = {
      ...states.base(gameState),
      name: states.StateName.PlayAgain,
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

function playAgainReducer(gameState: states.PlayAgain, messageState: MessageState, action: actions.GameAction): JointState {
  switch (action.type) {
    // case actions.RESIGN: // handled globally
    // case actions.OPPONENT_RESIGNED: // handled globally
    case actions.PLAY_AGAIN:
      if (gameState.player === Player.PlayerA) {
        // transition to WaitForResting
        const { myMove, theirMove, result } = gameState;
        const newGameState: states.WaitForRestingA = {
          ...states.base(gameState),
          name: states.StateName.WaitForRestingA,
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
        const newGameState: states.PickMove = {
          ...states.base(gameState),
          name: states.StateName.PickMove,
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

function waitForRestingAReducer(gameState: states.WaitForRestingA, messageState: MessageState, action: actions.GameAction): JointState {
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }

  const position = action.position;
  if (position.constructor.name !== 'Resting') { return { gameState, messageState }; }

  const newGameState: states.PickMove = {
    ...states.base(gameState),
    name: states.StateName.PickMove,
    turnNum: position.turnNum,
    balances: position.resolution,
    latestPosition: position,
  };

  return { gameState: newGameState, messageState };
}

function insufficientFundsReducer(gameState: states.InsufficientFunds, messageState: MessageState, action: actions.GameAction): JointState {
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
  const newGameState: states.GameOver = {
    ...states.base(gameState),
    name: states.StateName.GameOver,
    turnNum: latestPosition.turnNum,
    latestPosition,
  };

  return { gameState: newGameState, messageState };
}

function waitToResignReducer(gameState: states.WaitToResign, messageState: MessageState, action: actions.GameAction): JointState {
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }
  const { channel, turnNum, resolution: balances } = action.position;

  const newPosition = new Conclude(channel, turnNum + 1, balances);

  const newGameState: states.WaitForResignationAcknowledgement = {
    ...states.base(gameState),
    name: states.StateName.WaitForResignationAcknowledgement,
    turnNum: turnNum + 1,
    balances,
    latestPosition: newPosition,
  };

  messageState = { ...messageState, opponentOutbox: newPosition };

  return { gameState: newGameState, messageState };
}

// function opponentResignedReducer(gameState: states.OpponentResigned, messageState: MessageState, action: actions.GameAction) {
// }

function waitForResignationAcknowledgementReducer(gameState: states.WaitForResignationAcknowledgement, messageState: MessageState, action: actions.GameAction): JointState {
  if (action.type !== actions.POSITION_RECEIVED) { return { gameState, messageState }; }
  if (action.position.constructor.name !== 'Conclude') { return { gameState, messageState }; }

  const newGameState: states.GameOver = {
    ...states.base(gameState), 
    name: states.StateName.GameOver,
  };

  return { gameState: newGameState, messageState };
}

function gameOverReducer(gameState: states.GameOver, messageState: MessageState, action: actions.GameAction): JointState {
  if (action.type !== actions.WITHDRAWAL_REQUEST) { return { gameState, messageState }; }

  const newGameState: states.WaitForWithdrawal = { ...states.base(gameState), name: states.StateName.WaitForWithdrawal };
  messageState = { ...messageState, walletOutbox: 'WITHDRAWAL' };

  return { gameState: newGameState, messageState };
}

// function waitForWithdrawalReducer(gameState: states.WaitForWithdrawal, messageState: MessageState, action: actions.GameAction) {
// }
