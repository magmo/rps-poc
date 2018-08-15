import React, { PureComponent } from 'react';

import OpponentSelectionStep from './OpponentSelectionStep';
import WaitingStep from './WaitingStep';
import SelectPlayStep from './SelectPlayStep';
import * as playerA from '../game-engine/application-states/PlayerA';
import * as playerB from '../game-engine/application-states/PlayerB';
import { GameState } from '../redux/reducers/game';
import { Opponent } from '../redux/reducers/opponents';

import { Play } from '../game-engine/positions/index';

interface Props {
  applicationState: GameState;
  choosePlay: (play: Play) => void; // TODO: what should this be?
  chooseOpponent: (opponentAddress: string, stake: number) => void;
  opponents: Opponent[];
  subscribeOpponents: () => void;
  playComputer: (stake: number) => void;
}

export default class GameController extends PureComponent<Props> {
  render() {
    const {
      applicationState,
      choosePlay,
      chooseOpponent,
      opponents,
      subscribeOpponents,
      playComputer,
    } = this.props;

    if (applicationState === null) {
      subscribeOpponents();
      return (
        <OpponentSelectionStep
          chooseOpponent={chooseOpponent}
          playComputer={playComputer}
          opponents={opponents}
        />
      );
    }

    switch (applicationState && applicationState.constructor) {
      case playerA.ReadyToSendPreFundSetupA:
        return <WaitingStep message="ready to propose game" />;

      case playerA.WaitForPreFundSetupB:
        return <WaitingStep message="opponent to accept game" />;

      case playerA.ReadyToDeploy:
        return <WaitingStep message="ready to deploy adjudicator" />;

      case playerA.WaitForBlockchainDeploy:
        return <WaitingStep message="confirmation of adjudicator deployment" />;

      case playerA.WaitForBToDeposit:
        return <WaitingStep message="confirmation of opponent's deposit" />;

      case playerA.ReadyToSendPostFundSetupA:
        return <WaitingStep message="ready to send deposit confirmation" />;

      case playerA.WaitForPostFundSetupB:
        return <WaitingStep message="opponent to confirm deposits" />;

      case playerA.ReadyToChooseAPlay:
        return <SelectPlayStep choosePlay={choosePlay} />;

      case playerA.ReadyToSendPropose:
        return <WaitingStep message="ready to send round proposal" />;

      case playerA.WaitForAccept:
        return <WaitingStep message="opponent to choose their move" />;

      case playerA.ReadyToSendReveal:
        return <WaitingStep message="ready to send reveal" />;

      case playerA.WaitForResting:
        return <WaitingStep message="Wait for resting" />;
      
      case playerB.ReadyToSendPreFundSetupB:
        return <WaitingStep message="opponent to accept the outcome" />;

      case playerB.WaitForAToDeploy:
        return <WaitingStep message="opponent to accept the outcome" />;

      case playerB.ReadyToDeposit:
        return <WaitingStep message="opponent to accept the outcome" />;

      case playerB.WaitForBlockchainDeposit:
        return <WaitingStep message="opponent to accept the outcome" />;

      case playerB.WaitForPostFundSetupA:
        return <WaitingStep message="opponent to accept the outcome" />;

      case playerB.ReadyToSendPostFundSetupB:
        return <WaitingStep message="opponent to accept the outcome" />;

      case playerB.ReadyToChooseBPlay:
        return <SelectPlayStep choosePlay={choosePlay} />;

      case playerB.ReadyToSendAccept:
        return <WaitingStep message="opponent to accept the outcome" />;

      case playerB.WaitForReveal:
        return <WaitingStep message="opponent to accept the outcome" />;

      case playerB.ReadyToSendResting:
        return <WaitingStep message="opponent to accept the outcome" />;

      default:
      return <WaitingStep message={`[view not implemented: ${applicationState.constructor.name}`} />;
    }
  }
}
