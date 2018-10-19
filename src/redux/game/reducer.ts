import { Channel } from 'fmg-core';
import { Reducer } from 'redux';
import * as actions from './actions';
import * as state from './state';
import { Position, Conclude, PostFundSetupA, Propose, Accept, Reveal } from '../../game-engine/positions';
import { randomHex } from '../../utils/randomHex';
import { Player } from '../../game-engine/application-states';

export interface MessageState {
  opponentOutbox: Position | null;
  walletOutbox: string | null;
  actionToRetry: actions.PositionReceived | null;
}

const NULL_MESSAGE_STATE = { opponentOutbox: null, walletOutbox: null, actionToRetry: null };

interface JointState {
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
    // case state.StateName.PlayAgain:
    //   return playAgainReducer(gameState, messageState, action);
    // case state.StateName.WaitForRestingA:
    //   return waitForRestingAReducer(gameState, messageState, action);
    // case state.StateName.InsufficientFunds:
    //   return insufficientFundsReducer(gameState, messageState, action);
    // case state.StateName.WaitToResign:
    //   return waitToResignReducer(gameState, messageState, action);
    // case state.StateName.OpponentResigned:
    //   return opponentResignedReducer(gameState, messageState, action);
    // case state.StateName.WaitForResignationAcknowledgement:
    //   return waitForResignationAcknowledgementReducer(gameState, messageState, action);
    // case state.StateName.GameOver:
    //   return gameOverReducer(gameState, messageState, action);
    // case state.StateName.WaitForWithdrawal:
    //   return waitForWithdrawalReducer(gameState, messageState, action);
    default:
      // should be unreachable
      return jointState;
  }
}

function waitForGameConfirmationAReducer(
  gameState: state.WaitForGameConfirmationA, messageState: MessageState, action: actions.GameAction
) : JointState {
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

function waitForPostFundSetupReducer( gameState: state.WaitForPostFundSetup, messageState: MessageState, action: actions.GameAction): JointState {
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

// function waitForOpponentToPickMoveAReducer(gameState: state.WaitForOpponentToPickMoveA, messageState: MessageState, action: actions.GameAction) {
// }
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

// function waitForOpponentToPickMoveBReducer(gameState: state.WaitForOpponentToPickMoveB, messageState: MessageState, action: actions.GameAction) {
// }

// function waitForRevealBReducer(gameState: state.WaitForRevealB, messageState: MessageState, action: actions.GameAction) {
// }

// function playAgainReducer(gameState: state.PlayAgain, messageState: MessageState, action: actions.GameAction) {
// }

// function waitForRestingAReducer(gameState: state.WaitForRestingA, messageState: MessageState, action: actions.GameAction) {
// }

// function insufficientFundsReducer(gameState: state.InsufficientFunds, messageState: MessageState, action: actions.GameAction) {
// }

// function waitToResignReducer(gameState: state.WaitToResign, messageState: MessageState, action: actions.GameAction) {
// }

// function opponentResignedReducer(gameState: state.OpponentResigned, messageState: MessageState, action: actions.GameAction) {
// }

// function waitForResignationAcknowledgementReducer(gameState: state.WaitForResignationAcknowledgement, messageState: MessageState, action: actions.GameAction) {
// }

// function gameOverReducer(gameState: state.GameOver, messageState: MessageState, action: actions.GameAction) {
// }

// function waitForWithdrawalReducer(gameState: state.WaitForWithdrawal, messageState: MessageState, action: actions.GameAction) {
// }