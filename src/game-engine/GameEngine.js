import { GE_STAGES, GE_COMMANDS, GE_TO_AC_MAPPING } from '../constants';

export default class GameEngine {
  constructor(props) {
    this.state = {
      selectedPlayId: null,
      opponentMoveId: null,
      opponentId: null,
      stage: null,
      stake: null,
    };
  }

  init() {
    this.state.stage = GE_STAGES.SELECT_CHALLENGER;
    const updateObj = {
      stage: GE_TO_AC_MAPPING[this.state.stage],
    };

    return {
      updateObj,
    };
  }

  selectChallenge({ stake, opponentId }) {
    this.state.stage = GE_STAGES.READY_TO_SEND_PREFUND;
    this.state.stake = stake;
    this.state.opponentId = opponentId;

    const updateObj = {
      stage: GE_TO_AC_MAPPING[this.state.stage],
    };

    return {
      updateObj,
      command: GE_COMMANDS.SEND_PRE_FUND_MESSAGE,
    };
  }

  preFundProposalSent() {
    this.state.stage = GE_STAGES.PREFUND_SENT;

    const updateObj = {
      stage: GE_TO_AC_MAPPING[this.state.stage],
    };

    return {
      updateObj,
    };
  }

  selectPlay(selectedPlay) {
    this.setState({ stage: GE_STAGES.WAIT_FOR_OPPONENT_PLAY, selectedPlayId: selectedPlay });
  }

  confirmWager() {
    // TODO: Send message to player A
    this.setState({ stage: GE_STAGES.WAIT_FOR_PLAYER });
  }

  cancelGame() {
    // TODO: Send message to opponent
    this.setState({ stage: GE_STAGES.GAME_CANCELLED_BY_YOU });
  }

  returnToStart() {
    // TODO: Send message to opponent
    this.setState({ stage: GE_STAGES.SELECT_CHALLENGER });
  }
}


