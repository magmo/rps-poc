import { Channel } from 'fmg-core';
import * as AppStates from '..';

const gameLibrary = 0x111;
const channelNonce = 15;
const participantA = 0xa;
const participantB = 0xb;
const participants = [participantA, participantB];
const channel = new Channel(gameLibrary, channelNonce, participants);
const stake = 1;
const aBal = 4;
const bBal = 5
const balances = [aBal, bBal];
const coreProps = { channel, stake, balances };
const adjudicator = 0xc;
const aPlay = "rock";
const bPlay = "scissors";
const salt = "abc123";


const itHasSharedFunctionality = (appState) => {
  it("returns myAddress", () => {
    expect(appState.myAddress).toEqual(participantB);
  });

  it("returns opponentAddress", () => {
    expect(appState.opponentAddress).toEqual(participantA);
  });

  it("returns channelId", () => {
    expect(appState.channelId).toEqual(channel.channelId);
  });

  it("returns myBalance", () => {
    expect(appState.myBalance).toEqual(bBal);
  });

  it("returns opponentBalance", () => {
    expect(appState.opponentBalance).toEqual(aBal);
  });
};

describe("ReadyToSendPreFundSetupB", () => {
  let signedPreFundSetupBMessage = "blahblah";
  let appState = new AppStates.ReadyToSendPreFundSetupB({ ...coreProps, signedPreFundSetupBMessage });

  itHasSharedFunctionality(appState);

  it("has a message", () => {
    expect(appState.message).toEqual(signedPreFundSetupBMessage);
  });
});

describe("WaitForAToDeploy", () => {
  let appState = new AppStates.WaitForAToDeploy({ ...coreProps });

  itHasSharedFunctionality(appState);
});

describe("ReadyToDeposit", () => {
  let depositTransaction = { some: "transaction properties" };
  let appState = new AppStates.ReadyToDeposit({ ...coreProps, adjudicator, depositTransaction });

  itHasSharedFunctionality(appState);

  it("has a transaction", () => {
    expect(appState.transaction).toEqual(depositTransaction);
  });

  it("returns the address of the adjudicator", () => {
    expect(appState.adjudicator).toEqual(adjudicator);
  });
});

describe("WaitForBlockchainDeposit", () => {
  let appState = new AppStates.WaitForBlockchainDeposit({ ...coreProps, adjudicator });

  itHasSharedFunctionality(appState);

  it("returns the address of the adjudicator", () => {
    expect(appState.adjudicator).toEqual(adjudicator);
  });
});

describe("WaitForPostFundSetupA", () => {
  let appState = new AppStates.WaitForPostFundSetupA({ ...coreProps, adjudicator });

  itHasSharedFunctionality(appState);

  it("returns the address of the adjudicator", () => {
    expect(appState.adjudicator).toEqual(adjudicator);
  });
});

describe("ReadyToSendPostFundSetupB", () => {
  let signedPostFundSetupBMessage = "some message";
  let appState = new AppStates.ReadyToSendPostFundSetupB({
    ...coreProps,
    adjudicator,
    signedPostFundSetupBMessage,
  });

  itHasSharedFunctionality(appState);

  it("returns the address of the adjudicator", () => {
    expect(appState.adjudicator).toEqual(adjudicator);
  });

  it("has a message", () => {
    expect(appState.message).toEqual(signedPostFundSetupBMessage);
  });
});

describe("WaitForPropose", () => {
  let signedPostFundSetupBMessage = "some message";
  let appState = new AppStates.WaitForPropose({
    ...coreProps,
    adjudicator,
    signedPostFundSetupBMessage,
  });

  itHasSharedFunctionality(appState);

  it("returns the address of the adjudicator", () => {
    expect(appState.adjudicator).toEqual(adjudicator);
  });

  it("has a message", () => {
    expect(appState.message).toEqual(signedPostFundSetupBMessage);
  });
});

describe("ReadyToChooseBPlay", () => {
  let appState = new AppStates.ReadyToChooseBPlay({
    ...coreProps,
    adjudicator,
  });

  itHasSharedFunctionality(appState);

  it("returns the address of the adjudicator", () => {
    expect(appState.adjudicator).toEqual(adjudicator);
  });
});

describe("ReadyToSendAccept", () => {
  let signedAcceptMessage = "some message";
  let appState = new AppStates.ReadyToSendAccept({
    ...coreProps,
    adjudicator,
    bPlay,
    signedAcceptMessage,
  });

  itHasSharedFunctionality(appState);

  it("returns the address of the adjudicator", () => {
    expect(appState.adjudicator).toEqual(adjudicator);
  });

  it("returns b's play", () => {
    expect(appState.bPlay).toEqual(bPlay);
  });

  it("has a message", () => {
    expect(appState.message).toEqual(signedAcceptMessage);
  });
});

describe("WaitForReveal", () => {
  let signedAcceptMessage = "some message";
  let appState = new AppStates.WaitForReveal({
    ...coreProps,
    adjudicator,
    bPlay,
    signedAcceptMessage,
  });

  itHasSharedFunctionality(appState);

  it("returns the address of the adjudicator", () => {
    expect(appState.adjudicator).toEqual(adjudicator);
  });

  it("returns b's play", () => {
    expect(appState.bPlay).toEqual(bPlay);
  });

  it("has a message", () => {
    expect(appState.message).toEqual(signedAcceptMessage);
  });
});

describe("ReadyToSendResting", () => {
  let signedRestingMessage = "some message";
  let result = "lose";
  let appState = new AppStates.ReadyToSendResting({
    ...coreProps,
    adjudicator,
    bPlay,
    aPlay,
    salt,
    result,
    signedRestingMessage,
  });

  itHasSharedFunctionality(appState);

  it("returns the address of the adjudicator", () => {
    expect(appState.adjudicator).toEqual(adjudicator);
  });

  it("returns b's play", () => {
    expect(appState.bPlay).toEqual(bPlay);
  });

  it("returns a's play", () => {
    expect(appState.aPlay).toEqual(aPlay);
  });

  it("returns the salt", () => {
    expect(appState.aPlay).toEqual(aPlay);
  });

  it("returns the result", () => {
    expect(appState.result).toEqual(result);
  });

  it("has a message", () => {
    expect(appState.message).toEqual(signedRestingMessage);
  });
});
