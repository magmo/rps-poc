
class ReadySendPreFundSetup0 {
    constructor({ channel, stake, balances, signedPreFundSetup0Message }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.message = signedPreFundSetup0Message;
    }
}

class WaitForPreFundSetup1 { 
    constructor({ channel, stake, balances, signedPreFundSetup0Message }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.message = signedPreFundSetup0Message; // in case a resend is required
    }
}

class ReadyToDeploy {
    constructor({ channel, stake, balances, deploymentTransaction }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.transaction = deploymentTransaction;
    }
}

class WaitForBlockchainDeploy {
    constructor({ channel, stake, balances }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
    }
}

class WaitForBToDeploy {
    constructor({ channel, stake, balances, adjAddress }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjAddress = adjAddress;
    }
}

class ReadyToSendPostFundSetup0 {
    constructor({ channel, stake, balances, adjAddress, signedPostFundSetup0Message }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjAddress = adjAddress;
        this.message = signedPostFundSetup0Message;
    }
}

class WaitForPostFundSetup1 {
    constructor({ channel, stake, balances, adjAddress, signedPostFundSetup0Message }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjAddress = adjAddress;
        this.message = signedPostFundSetup0Message; // in case a resend is required
    }
}

class ReadyToChooseAPlay {
    constructor({ channel, stake, balances, adjAddress }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.adjAddress = adjAddress;
    }
}

class ReadyToSendPropose {
    constructor({ channel, stake, balances, adjAddress, aPlay, salt, signedProposeMessage }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.aPlay = aPlay;
        this.salt = salt;
        this.adjAddress = adjAddress;
        this.message = signedProposeMessage;
    }
}

class WaitForAccept {
    constructor({ channel, stake, balances, adjAddress, aPlay, salt, signedProposeMessage }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.aPlay = aPlay;
        this.salt = salt;
        this.adjAddress = adjAddress;
        this.message = signedProposeMessage; // in case a resend is required
    }
}

class ReadyToSendReveal {
    constructor({ channel, stake, balances, adjAddress, aPlay, bPlay, result, salt, signedRevealMessage }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.aPlay = aPlay;
        this.bPlay = bPlay;
        this.result = result; // win/lose/draw
        this.salt = salt;
        this.adjAddress = adjAddress;
        this.message = signedRevealMessage;
    }
}

class WaitForResting {
    constructor({ channel, stake, balances, adjAddress, aPlay, bPlay, result, salt, signedRevealMessage }) {
        this._channel = channel;
        this._balances = balances;
        this.stake = stake;
        this.aPlay = aPlay;
        this.bPlay = bPlay;
        this.result = result; // win/lose/draw
        this.salt = salt;
        this.adjAddress = adjAddress;
        this.message = signedRevealMessage; // in case a resend is required
    }
}

export {
    ReadySendPreFundSetup0,
    WaitForPreFundSetup1,
    ReadyToDeploy,
    WaitForBlockchainDeploy,
    WaitForBToDeploy,
    ReadyToSendPostFundSetup0,
    WaitForPostFundSetup1,
    ReadyToChooseAPlay,
    ReadyToSendPropose,
    WaitForAccept,
    ReadyToSendReveal,
    WaitForResting
}