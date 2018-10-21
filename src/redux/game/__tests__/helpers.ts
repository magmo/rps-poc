import { gameReducer, JointState } from '../reducer';
import { Player, positions } from '../../../core';
import * as actions from '../actions';
import * as state from '../state';

export const itSends = (position, jointState) => {
  it(`sends ${position.constructor.name}`, () => {
    expect(jointState.messageState.opponentOutbox).toEqual(position);
  });
};

export const itTransitionsTo = (stateName, jointState) => {
  it(`transitions to ${stateName}`, () => {
    expect(jointState.gameState.name).toEqual(stateName);
  });
};

export const itStoresAction = (action, jointState) => {
  it(`stores action to retry`, () => {
    expect(jointState.messageState.actionToRetry).toEqual(action);
  });
};

export const itsPropertiesAreConsistentWithItsPosition = (jointState) => {
  it(`updates its properties to be consistent with the latest position`, () => {
    const gameState = jointState.gameState;
    const position = gameState.latestPosition;
    expect(gameState.balances).toEqual(position.resolution);
    expect(gameState.turnNum).toEqual(position.turnNum);
  });
};

export const itHandlesResignWhenTheirTurn = (jointState: JointState) => {
  describe('when resigning on their turn', () => {
    it ('transitions to WaitToResign', () => {
      const { gameState } = jointState;
      const { latestPosition: oldPosition } = gameState;
      const updatedState = gameReducer(jointState, actions.resign());
      const { latestPosition: position } = updatedState.gameState as state.GameState;

      expect(updatedState.gameState.name).toEqual(state.StateName.WaitToResign);
      expect(updatedState.gameState).toMatchObject({
        name: state.StateName.WaitToResign,
        turnNum: oldPosition.turnNum,
      });
      expect(position).toEqual(oldPosition);
    });
  });
};

export const itHandlesResignWhenMyTurn = (jointState: JointState) => {
  describe('when resigning on my turn', () => {
    it ('transitions to WaitToResign', () => {
      const { gameState } = jointState;
      const { latestPosition: oldPosition } = gameState;
      const updatedState = gameReducer(jointState, actions.resign());
      const { latestPosition: position } = updatedState.gameState as state.GameState;

      expect(updatedState.gameState.name).toEqual(state.StateName.WaitForResignationAcknowledgement);
      expect(updatedState.gameState).toMatchObject({
        name: state.StateName.WaitForResignationAcknowledgement,
        turnNum: oldPosition.turnNum + 1,
        balances: gameState.balances,
        player: Player.PlayerA,
      });
      const newConclude = positions.conclude({...oldPosition, turnNum: oldPosition.turnNum + 1});
      expect(position).toEqual(newConclude);
    });
  });
};

export const itCanHandleTheOpponentResigning = ({ gameState, messageState }) => {
  const { turnNum } = gameState.latestPosition;
  const isTheirTurn = gameState.player === Player.PlayerA ? turnNum % 2 === 0 : turnNum % 2 !== 0;
  const newTurnNum = isTheirTurn ? turnNum : turnNum + 1;
  const oldPosition = gameState.latestPosition;
  const theirConclude = positions.conclude({ ...oldPosition, turnNum: newTurnNum });
  const ourConclude = positions.conclude({ ...oldPosition, turnNum: newTurnNum + 1 });
  const action = actions.opponentResigned(theirConclude);

  const updatedState = gameReducer({ gameState, messageState }, action);

  itTransitionsTo(state.StateName.OpponentResigned, updatedState);
  itSends(ourConclude, updatedState);
};
