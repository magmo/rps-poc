export default class ReadyToSendPreFundSetup0 {
    constructor({ channelState, message }) {
        this._channelState = channelState;
        this.message = message;
    }

    get salt() {
        return channelState.salt;
    }



}