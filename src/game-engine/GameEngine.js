import { GAME_STAGES } from '../constants';

export default class GameEngine {
  constructor(props) {
    this.state = {
      opponents: [],
      selectedPlayId: null,
      opponentMoveId: null,
      stage: null,
    };
  }

  start() {
    this.state.stage = GAME_STAGES.SELECT_CHALLENGER;
    return {
      stage: this.state.stage,
    };
  }

  selectChallenge() {
    return {
      stage: GAME_STAGES.SELECT_PLAY,
    }
  }

  choose() {

  }

  selectPlay(selectedPlay) {
    this.setState({ stage: GAME_STAGES.WAIT_FOR_OPPONENT_PLAY, selectedPlayId: selectedPlay });
  }

  confirmWager() {
    // TODO: Send message to player A
    this.setState({ stage: GAME_STAGES.WAIT_FOR_PLAYER });
  }

  cancelGame() {
    // TODO: Send message to opponent
    this.setState({ stage: GAME_STAGES.GAME_CANCELLED_BY_YOU });
  }

  returnToStart() {
    // TODO: Send message to opponent
    this.setState({ stage: GAME_STAGES.SELECT_CHALLENGER });
  }
}


