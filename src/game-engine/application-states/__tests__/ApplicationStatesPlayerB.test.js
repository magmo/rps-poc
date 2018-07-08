import * as AppStates from '../ApplicationStatesPlayerB';
import { Channel } from 'fmg-core';

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

describe("ReadyToSendPreFundSetup0", () => {
    let signedPreFundSetup1Message = "blahblah";
    let appState = new AppStates.ReadyToSendPreFundSetup1({ ...coreProps, signedPreFundSetup1Message });

    itHasSharedFunctionality(appState);

    it("has a message", () => {
        expect(appState.message).toEqual(signedPreFundSetup1Message);
    });
});

