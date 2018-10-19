import React from 'react';
import { connect } from 'react-redux';

import * as gameActions from '../redux/game/actions';
import * as walletActions from '../wallet/redux/actions/external';

import WaitingStep from '../components/WaitingStep';
import SelectPlayPage from '../components/SelectPlayPage';
import GameProposedPage from '../components/GameProposedPage';
import FundingConfirmedPage from '../components/FundingConfirmedPage';
import PlaySelectedPage from '../components/PlaySelectedPage';
import ResultPage from '../components/ResultPage';
import { WalletController } from '../wallet';

import { SiteState } from '../redux/reducer';


import { Play } from '../game-engine/positions';
import WalletHeader from 'src/wallet/containers/WalletHeader';
import { GameState,StateName } from 'src/redux/game/state';

interface GameProps {
  state: GameState;
  showWallet: boolean;
  showWalletHeader: boolean;
  choosePlay: (play: Play) => void;
  abandonGame: () => void;
  playAgain: () => void;
  createBlockchainChallenge: () => void;
}

function GameContainer(props: GameProps) {

  if (props.showWallet) {
    return <WalletController/>;
  }
  else if (props.showWalletHeader){
    return <WalletHeader>{RenderGame(props)}</WalletHeader>;
  }else{
    return RenderGame(props);
  }
  
}
function RenderGame(props:GameProps){
  const { state, choosePlay, playAgain, abandonGame, createBlockchainChallenge } = props;
  switch (state.name) {
    case StateName.WaitForGameConfirmationA:
      return <GameProposedPage message="Waiting for your opponent to accept game" />;
    case StateName.ConfirmGameB:
      return <FundingConfirmedPage message="Waiting for your opponent to acknowledge" />;

    case StateName.PickMove:
      return <SelectPlayPage choosePlay={choosePlay} abandonGame={abandonGame} />;

    case StateName.WaitForOpponentToPickMoveA:
      return (
        <PlaySelectedPage
          message="Waiting for your opponent to choose their move"
          yourPlay={state.myMove}
          createBlockchainChallenge={createBlockchainChallenge}
        />
      );

    case StateName.WaitForRestingA:
      return (
        <PlaySelectedPage
        message="Waiting for resting"
        yourPlay={state.myMove}
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
        <PlaySelectedPage
          message="Waiting for your opponent to choose their move"
          yourPlay={state.myMove}
          createBlockchainChallenge={createBlockchainChallenge}
        />
      );

    case StateName.PlayAgain:
      return (
        <ResultPage
          message="Waiting for opponent to suggest a new game"
          yourPlay={state.myMove}
          theirPlay={state.theirMove}
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
  choosePlay: gameActions.choosePlay,
  playAgain: gameActions.playAgain,
  abandonGame: gameActions.resign,
  createBlockchainChallenge: walletActions.createChallenge,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameContainer);
