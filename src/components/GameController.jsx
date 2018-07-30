import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import OpponentSelectionStep from './OpponentSelectionStep';
import WaitingStep from './WaitingStep';
import LoginPage from './LoginPage';
import SelectPlayStep from './SelectPlayStep';
import { types as playerAStates } from '../game-engine/application-states/ApplicationStatesPlayerA';

export default class GameController extends PureComponent {
  render() {
    const {
      applicationState,
      chooseAPlay,
      proposeGame,
      login,
      logout,
      opponents,
      subscribeOpponents,
      loggedIn,
    } = this.props;

    if (!loggedIn) {
      return <LoginPage login={login} logout={logout} loggedIn={loggedIn} />;
    }

    if (!applicationState.type) {
      subscribeOpponents();
      return (
        <OpponentSelectionStep
          proposeGame={proposeGame}
          opponents={opponents}
        />
      );
    }

    switch (applicationState && applicationState.type) {
      case playerAStates.ReadyToSendPreFundSetup0:
        return <WaitingStep message="ready to propose game" />;

      case playerAStates.WaitForPreFundSetup1:
        return <WaitingStep message="opponent to accept game" />;

      case playerAStates.ReadyToDeploy:
        return <WaitingStep message="ready to deploy adjudicator" />;

      case playerAStates.WaitForBlockchainDeploy:
        return <WaitingStep message="confirmation of adjudicator deployment" />;

      case playerAStates.WaitForBToDeposit:
        return <WaitingStep message="confirmation of opponent's deposit" />;

      case playerAStates.ReadyToSendPostFundSetup0:
        return <WaitingStep message="ready to send deposit confirmation" />;

      case playerAStates.WaitForPostFundSetup1:
        return <WaitingStep message="opponent to confirm deposits" />;

      case playerAStates.ReadyToChooseAPlay:
        return <SelectPlayStep handleSelectPlay={chooseAPlay} />;

      case playerAStates.ReadyToSendPropose:
        return <WaitingStep message="ready to send round proposal" />;

      case playerAStates.WaitForAccept:
        return <WaitingStep message="opponent to choose their move" />;

      case playerAStates.ReadyToSendReveal:
        return <WaitingStep message="ready to send reveal" />;

      case playerAStates.WaitForResting:
        return <WaitingStep message="opponent to accept the outcome" />;

      default:
        return null;
        // oops something went wrong
    }
  }
}

GameController.propTypes = {
  applicationState: PropTypes.object.isRequired,
  chooseAPlay: PropTypes.func.isRequired,
  proposeGame: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  opponents: PropTypes.arrayOf(PropTypes.object).isRequired,
  subscribeOpponents: PropTypes.func.isRequired,
};
