export default class ReadyToSendPreFundSetup0 {
    constructor({ opponent, stake, balances, message }) {
        this.opponent = opponent; // address of opponent
        this.stake = stake;
        this.balances = balances;
        this.message = message;
    }

    constructor({ channelState, message }) {
        this._channelState = channelState;
        this.message = message;
    }

    get opponent() {
        return this._channelState.participants[1];
    }

    get stake() {
        return this._channelState.stake;
    }
}