import { types } from '../actions/game';
import { Channel } from 'fmg-core';
import * as playerA from '../../game-engine/application-states/ApplicationStatesPlayerA';

// Fake data for development purposes
const gameLibrary = 0x111;
const channelNonce = 15;
const participantA = 0xa;
const participantB = 0xb;
const participants = [participantA, participantB];
const channel = new Channel(gameLibrary, channelNonce, participants);
const stake = 1;
const aBal = 4;
const bBal = 5;
const balances = [aBal, bBal];
const coreProps = { channel, stake, balances };
const adjudicator = 0xc;
const aPlay = 'rock';
const bPlay = 'scissors';
const salt = 'abc123';

// todo: rewrite this to use the gameEngine and return actual data
export default function gameReducer(state = {}, action = {}) {
  let signedPreFundSetup0Message;
  let signedProposeMessage;

  switch (action.type) {
    case types.CHOOSE_OPPONENT:
      signedPreFundSetup0Message = 'blah';
      return new playerA.ReadyToSendPreFundSetup0({ ...coreProps, signedPreFundSetup0Message });

    case types.CHOOSE_A_PLAY:
      signedProposeMessage = 'blah';
      return new playerA.ReadyToSendPropose({
        ...coreProps,
        adjudicator,
        aPlay,
        salt,
        signedProposeMessage,
      });

    case types.MESSAGE_SENT:
      switch (state.type) {
        case playerA.types.ReadyToSendPreFundSetup0:
          signedPreFundSetup0Message = 'blah';
          return new playerA.WaitForPreFundSetup1({ ...coreProps, signedPreFundSetup0Message });
        case playerA.types.ReadyToSendPostFundSetup0:
          const signedPostFundSetup0Message = 'blah';
          return new playerA.WaitForPostFundSetup1({
            ...coreProps,
            adjudicator,
            signedPostFundSetup0Message,
          });
        case playerA.types.ReadyToSendPropose:
          signedProposeMessage = 'blah';
          return new playerA.WaitForAccept({
            ...coreProps,
            adjudicator,
            aPlay,
            salt,
            signedProposeMessage,
          });
        case playerA.types.ReadyToSendReveal:
          const signedRevealMessage = 'blah';
          const result = 'win';
          return new playerA.WaitForResting({
            ...coreProps,
            adjudicator,
            aPlay,
            bPlay,
            result,
            salt,
            signedRevealMessage,
          });
        default:
      }
      break;

    case types.MESSAGE_RECEIVED:
      switch (state.type) {
        case playerA.types.WaitForPreFundSetup1:
          const deploymentTransaction = 'blah';
          return new playerA.WaitForBlockchainDeploy({ ...coreProps, deploymentTransaction });
        case playerA.types.WaitForPostFundSetup1:
          return new playerA.ReadyToChooseAPlay({ ...coreProps, adjudicator });
        case playerA.types.WaitForAccept:
          const signedRevealMessage = 'blah';
          const result = 'win';
          return new playerA.ReadyToSendReveal({
            ...coreProps,
            adjudicator,
            aPlay,
            bPlay,
            result,
            salt,
            signedRevealMessage,
          });
        default:
      }
      break;

    case types.EVENT_RECEIVED:
      switch (state.type) {
        case playerA.types.WaitForBlockchainDeploy:
          return new playerA.WaitForBToDeposit({ ...coreProps, adjudicator });
        case playerA.types.WaitForBToDeposit:
          const signedPostFundSetup0Message = 'blah';
          return new playerA.ReadyToSendPostFundSetup0({
            ...coreProps,
            adjudicator,
            signedPostFundSetup0Message,
          });
        default:
      }
      break;

    default:
      return state;
  }
}
