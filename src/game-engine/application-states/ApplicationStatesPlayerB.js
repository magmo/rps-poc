class ReadyToSendPreFundSetup1 {
    constructor({ channel, stake, balances, signedPreFundSetup1Message }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.message = signedPreFundSetup1Message;
    }
}

class WaitForAToDeploy {
    constructor({ channel, stake, balances }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
    }
}

class ReadyToDeposit {
    constructor({ channel, stake, balances, adjudicator, depositTransaction }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjudicator = adjudicator; // address of adjudicator
        this.transaction = depositTransaction;
    }
}

class WaitForBlockchainDeposit {
    constructor({ channel, stake, balances, adjudicator }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjudicator = adjudicator; // address of adjudicator
    }
}

class WaitForPostFundSetup0 {
    constructor({ channel, stake, balances, adjudicator }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjudicator = adjudicator; // address of adjudicator
    }
}

class ReadyToSendPostFundSetup1 {
    constructor({ channel, stake, balances, adjudicator, signedPostFundSetup1Message }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjudicator = adjudicator;
        this.message = signedPostFundSetup1Message;
    }
}

class WaitForPropose {
    constructor({ channel, stake, balances, adjudicator, signedPostFundSetup1Message }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjudicator = adjudicator;
        this.message = signedPostFundSetup1Message; // in case resend necessary
    }
}

class ReadyToChooseBPlay {
    constructor({ channel, stake, balances, adjudicator }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjudicator = adjudicator;
    }
}

class ReadyToSendAccept {
    constructor({ channel, stake, balances, adjudicator, bPlay, signedAcceptMessage }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjudicator = adjudicator;
        this.bPlay = bPlay;
        this.message = signedAcceptMessage;
    }
}

class WaitForReveal {
    constructor({ channel, stake, balances, adjudicator, bPlay, signedAcceptMessage }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjudicator = adjudicator;
        this.bPlay = bPlay;
        this.message = signedAcceptMessage; // in case resend necessary
    }
}

class ReadyToSendResting {
    constructor({ channel, stake, balances, adjudicator, aPlay, bPlay, result, salt, signedRestingMessage }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.aPlay = aPlay;
        this.bPlay = bPlay;
        this.result = result; // win/lose/draw
        this.salt = salt;
        this.adjudicator = adjudicator;
        this.message = signedRestingMessage; // in case a resend is required
    }
}

export {
    ReadyToSendPreFundSetup1,
    WaitForAToDeploy,
    ReadyToDeposit,
    WaitForBlockchainDeposit,
    WaitForPostFundSetup0,
    ReadyToSendPostFundSetup1,
    WaitForPropose,
    ReadyToChooseBPlay,
    ReadyToSendAccept,
    WaitForReveal,
    ReadyToSendResting,
}