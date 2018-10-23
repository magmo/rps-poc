import React from 'react';
import { connect } from 'react-redux';

import * as gameActions from '../redux/game/actions';
import * as walletActions from '../wallet/redux/actions/external';

import WaitingStep from '../components/WaitingStep';
import SelectMovePage from '../components/SelectMovePage';
import GameProposedPage from '../components/GameProposedPage';
import FundingConfirmedPage from '../components/FundingConfirmedPage';
import MoveSelectedPage from '../components/MoveSelectedPage';
import ResultPage from '../components/ResultPage';
import { WalletController } from '../wallet';

import { SiteState } from '../redux/reducer';


import { Move } from '../core';
import WalletHeader from '../wallet/containers/WalletHeader';
import { GameState, StateName } from '../redux/game/state';
import ConfirmGamePage from '../components/ConfirmGamePage';

interface GameProps {
  state: GameState;
  showWallet: boolean;
  showWalletHeader: boolean;
  chooseMove: (move: Move) => void;
  abandonGame: () => void;
  playAgain: () => void;
  createBlockchainChallenge: () => void;
  confirmGame:()=>void;
}

function GameContainer(props: GameProps) {
  if (props.showWallet) {
    return <WalletController />;
  }
  else if (props.showWalletHeader) {
    return <WalletHeader>{RenderGame(props)}</WalletHeader>;
  } else {
    return RenderGame(props);
  }

}

function RenderGame(props: GameProps) {
  const { state, chooseMove, playAgain, abandonGame, createBlockchainChallenge, confirmGame} = props;
  switch (state.name) {
    case StateName.WaitForGameConfirmationA:
      return <GameProposedPage message="Waiting for your opponent to accept game" />;
    case StateName.ConfirmGameB:
      return <ConfirmGamePage  confirmGame={confirmGame} cancelGame={()=>{return;}}  stake={state.roundBuyIn} opponentName={state.opponentName}/>;

    case StateName.PickMove:
      return <SelectMovePage chooseMove={chooseMove} abandonGame={abandonGame} />;

    case StateName.WaitForOpponentToPickMoveA:
      return (
        <MoveSelectedPage
          message="Waiting for your opponent to choose their move"
          yourMove={state.myMove}
          createBlockchainChallenge={createBlockchainChallenge}
        />
      );

    case StateName.WaitForRestingA:
      return (
        <MoveSelectedPage
          message="Waiting for resting"
          yourMove={state.myMove}
          createBlockchainChallenge={createBlockchainChallenge}
        />
      );

    case StateName.GameOver:
      return <WalletController />;
    case StateName.WaitForPostFundSetup:
      return <FundingConfirmedPage message="Waiting for your opponent to acknowledge" />;

    case StateName.WaitForOpponentToPickMoveB:
      return <WaitingStep createBlockchainChallenge={createBlockchainChallenge} message="Waiting for your opponent to choose their move" />;

    case StateName.WaitForRevealB:
      return (
        <MoveSelectedPage
          message="Waiting for your opponent to choose their move"
          yourMove={state.myMove}
          createBlockchainChallenge={createBlockchainChallenge}
        />
      );

    case StateName.PlayAgain:
      return (
        <ResultPage
          message="Waiting for opponent to suggest a new game"
          yourMove={state.myMove}
          theirMove={state.theirMove}
          result={state.result}
          playAgain={playAgain}
          abandonGame={abandonGame}
        />
      );
    default:
      return <div>View not created for {state.name}</div>;
  }
}
const mapStateToProps = (state: SiteState) => ({
  state: state.game.gameState as GameState,
  showWallet: state.wallet.display.showWallet,
  showWalletHeader: state.wallet.display.showHeader,
});

const mapDispatchToProps = {
  chooseMove: gameActions.chooseMove,
  playAgain: gameActions.playAgain,
  abandonGame: gameActions.resign,
  createBlockchainChallenge: walletActions.createChallenge,
  confirmGame: gameActions.confirmGame,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameContainer);
