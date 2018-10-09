
import * as State from './wallet-states';
export default class WalletChallengeEngine {
    static setupEngine() {
        return new WalletChallengeEngine(new State.ChallengeRequested());
    }
    state: any;
    constructor(state) {
        this.state = state;
    }


}
