import _ from 'lodash';
import React from 'react';

import fire from '../gateways/firebase';
import Opponent from '../domain/opponent';

// Views
import ConcludeStep from './ConcludeStep';
import ConfirmWagerStep from './ConfirmWagerStep';
import GameCancelledStep from './GameCancelledStep';
import OpponentSelectionStep from './OpponentSelectionStep';
import RevealStep from './RevealStep';
import SelectPlayStep from './SelectPlayStep';
import SendingMessageStep from './SendingMessageStep';
import WaitingStep from './WaitingStep';

import GameEngine from '../game-engine/GameEngine';

import { AC_VIEWS, GE_COMMANDS, GE_TO_AC_MAPPING } from '../constants';

function postNewChallenge(newOpponent) {
  fire
    .database()
    .ref()
    .child('opponents')
    .push(newOpponent);
}

export default class PlayPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ge = new GameEngine();

    this.state = {
      // any frontend only state goes here...
      opponents: [],
      stage: GE_TO_AC_MAPPING[this.ge.init().updateObj.state],
    };

    _.bindAll(this, [
      'createChallenge',
      'opponentsListener',
      'selectChallenge',
      'selectPlay',
      'confirmWager',
      'cancelGame',
      'returnToStart',
      'handleReturnMessage',

      // command handlers
      'sendPreFundMessage',
      'sendPostFundMessage',
    ]);

    this.commandMapping = {
      [GE_COMMANDS.SEND_PRE_FUND_MESSAGE]: this.sendPreFundMessage,
      [GE_COMMANDS.SEND_POST_FUND_MESSAGE]: this.sendPostFundMessage,
      // TODO: fill in commands with corresponding functions
    };
  }

  componentWillMount() {
    this.opponentsListener();
  }

  // Handlers

  createChallenge(name, wager) {
    let newOpponent = new Opponent({ name, wager });
    postNewChallenge(newOpponent);
  }

  selectChallenge({ stake, opponentId }) {
    const returnMessage = GE_TO_AC_MAPPING[this.ge.selectChallenge({ stake, opponentId })];
    this.handleReturnMessage(returnMessage);
  }

  sendPreFundMessage() {
    // TODO: Send pre-fund proposal message
    console.log('sending pre-fund proposal message');

    const returnMessage = GE_TO_AC_MAPPING[this.ge.preFundProposalSent()];
    // This is just to add a delay so that we can see the various states
    setTimeout(() => this.handleReturnMessage(returnMessage), 1500);
  }

  sendPostFundMessage() {
    // TODO: Send pre-fund proposal message
    console.log('sending post-fund message');

    const returnMessage = GE_TO_AC_MAPPING[this.ge.preFundProposalSent()];
    this.handleReturnMessage(returnMessage);
  }

  handleReturnToOpponentSelection() {
    const returnMessage = GE_TO_AC_MAPPING[this.ge.returnToOpponentSelection()];
    this.handleReturnMessage(returnMessage);
  }

  selectPlay(selectedPlay) {
    this.setState({ stage: AC_VIEWS.WAITING_FOR_PLAYER, selectedPlayId: selectedPlay });
  }

  confirmWager() {
    // TODO: Send message to player A
    this.setState({ stage: AC_VIEWS.WAIT_FOR_PLAYER });
  }

  cancelGame() {
    // TODO: Send message to opponent
    this.setState({ stage: AC_VIEWS.GAME_CANCELLED_BY_YOU });
  }

  returnToStart() {
    // TODO: Send message to opponent
    this.setState({ stage: AC_VIEWS.SELECT_CHALLENGER });
  }

  // Firebase API calls

  opponentsListener() {
    let opponentsRef = fire
      .database()
      .ref('opponents')
      .orderByKey();
    opponentsRef.on('value', snapshot => {
      let opponents = _.map(snapshot.val(), opponent => opponent);
      this.setState({ opponents });
    });
  }

  handleReturnMessage(returnMessage) {
    if (returnMessage.updateObj) {
      this.setState(returnMessage.updateObj);
    }

    if (returnMessage.command) {
      if (!this.commandMapping[returnMessage.command]) {
        console.error('command from Game Engine not found in mapping');
      }
      this.commandMapping[returnMessage.command]();
    }
  }

  render() {
    const { stage, selectedPlayId, opponentPlayId, opponents } = this.state;

    switch (stage) {
      case AC_VIEWS.SELECT_CHALLENGER:
        return (
          <OpponentSelectionStep
            handleSelectChallenge={this.selectChallenge}
            handleCreateChallenge={this.createChallenge}
            opponents={opponents}
          />
        );
      case AC_VIEWS.CONFIRM_WAGER:
        return (
          <ConfirmWagerStep
            wager={300}
            handleReject={this.cancelGame}
            handleConfirm={this.confirmWager}
          />
        );
      case AC_VIEWS.SELECT_PLAY:
        return <SelectPlayStep handleSelectPlay={this.selectPlay} />;
      case AC_VIEWS.SELECT_PLAY_AFTER_OPPONENT:
        return <SelectPlayStep afterOpponent handleSelectPlay={this.selectPlay} />;
      case AC_VIEWS.REVEAL_WINNER_WITH_PROMPT:
        return <RevealStep selectedPlayId={selectedPlayId} opponentPlayId={opponentPlayId} />;
      case AC_VIEWS.CONCLUDE_GAME:
        return (
          <ConcludeStep
            handleReturnToOpponentSelection={this.handleReturnToOpponentSelection}
            winnings={50}
          />
        );
      case AC_VIEWS.WAITING_FOR_PLAYER:
        return <WaitingStep selectedPlayId={selectedPlayId} />;
      case AC_VIEWS.WAITING_FOR_CHAIN:
        return <WaitingStep forChain selectedPlayId={selectedPlayId} />;
      case AC_VIEWS.SENDING_MESSAGE:
        return <SendingMessageStep />;
      case AC_VIEWS.GAME_CANCELLED_BY_YOU:
        return <GameCancelledStep cancelledBySelf returnToStart={this.returnToStart} />;
      case AC_VIEWS.GAME_CANCELLED_BY_OPPONENT:
        return <GameCancelledStep returnToStart={this.returnToStart} />;
      default:
        console.log('The following state does not have an associated step component: ', stage);
        return null;
    }
  }
}
