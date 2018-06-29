import _ from 'lodash';
import React from 'react';

import fire from '../gateways/firebase';
import Opponent from '../domain/opponent';
import OpponentSelectionStep from './OpponentSelectionStep';
import SelectPlayStep from './SelectPlayStep';
import WaitForOpponentStep from './WaitForOpponentStep';
import RevealStep from './RevealStep';
import ConfirmWagerStep from './ConfirmWagerStep';
import GameCancelledStep from './GameCancelledStep';
import GameEngine from '../game-engine/GameEngine';

import { GAME_STAGES } from '../constants';

export default class PlayPage extends React.PureComponent {
  constructor(props) {
    super(props);


    this.ge = new GameEngine();

    this.state = {
      // any frontend only state goes here...
      opponents: [],
      ...this.ge.start(),
    };

    _.bindAll(this, [
      'createChallenge',
      'opponentsListener',
      'postNewChallenge',
      'selectChallenge',
      'selectPlay',
      'confirmWager',
      'cancelGame',
      'returnToStart',
    ]);
  }

  componentWillMount() {
    this.opponentsListener();
  }

  // Handlers

  createChallenge(name, wager) {
    let newOpponent = new Opponent({ name, wager });
    this.postNewChallenge(newOpponent);
  }

  selectChallenge() {
    const updateObj = this.ge.selectChallenge();

    this.setState(updateObj);
  }

  selectPlay(selectedPlay) {

    this.setState({ stage: GAME_STAGES.WAITING_FOR_PLAYER, selectedPlayId: selectedPlay });
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

  postNewChallenge(newOpponent) {
    fire
      .database()
      .ref()
      .child('opponents')
      .push(newOpponent);
  }

  render() {
    const { stage, selectedPlayId, opponentPlayId, opponents } = this.state;

    switch (stage) {
      case GAME_STAGES.SELECT_CHALLENGER:
        return (
          <OpponentSelectionStep
            handleSelectChallenge={this.selectChallenge}
            handleCreateChallenge={this.createChallenge}
            opponents={opponents}
          />
        );
      case GAME_STAGES.INITIALIZE_SETUP:
        // TODO: add component
        return null;
      case GAME_STAGES.CHOOSE_WAGER:
        // TODO: add component
        return null;
      case GAME_STAGES.GAME_ACCEPT_RECEIVED:
        // TODO: add component
        return null;
      case GAME_STAGES.CONFIRM_WAGER:
        return (
          <ConfirmWagerStep
            wager={300}
            handleReject={this.cancelGame}
            handleConfirm={this.confirmWager}
          />
        );
      case GAME_STAGES.SELECT_PLAY:
        return <SelectPlayStep handleSelectPlay={this.selectPlay} />;
      case GAME_STAGES.SELECT_PLAY_AFTER_OPPONENT:
        return <SelectPlayStep handleSelectPlay={this.selectPlay} />;
      case GAME_STAGES.REVEAL_WINNER_WITH_PROMPT:
        return <RevealStep selectedPlayId={selectedPlayId} opponentPlayId={opponentPlayId} />;
      case GAME_STAGES.CONCLUDE_GAME:
        // TODO: add component
        return null;
      case GAME_STAGES.WAITING_FOR_PLAYER:
        return <WaitForOpponentStep selectedPlayId={selectedPlayId} />;
      case GAME_STAGES.WAITING_FOR_CHAIN:
        // TODO: add component
        return null;
      case GAME_STAGES.GAME_CANCELLED_BY_YOU:
        return <GameCancelledStep cancelledBySelf returnToStart={this.returnToStart} />;
      case GAME_STAGES.GAME_CANCELLED_BY_OPPONENT:
        return <GameCancelledStep returnToStart={this.returnToStart} />;
      default:
        console.log('The following state does not have an associated step component: ', stage);
        return null;
    }
  }
}


