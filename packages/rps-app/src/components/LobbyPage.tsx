import _ from 'lodash';
import React from 'react';

import { OpenGame } from '../redux/open-games/state';

import { Button } from 'reactstrap';
import { ApplicationLayout } from './ApplicationLayout';
import { OpenGameEntry } from './OpenGameCard';
import CreatingOpenGameContainer from '../containers/CreatingOpenGameContainer';

interface Props {
  openGames: OpenGame[];
  joinOpenGame: (
    opponentName: string,
    opponentAddress: string,
    channelNonce: number,
    roundBuyIn: string,
  ) => void;
  newOpenGame: () => void;
}

const initialState = { showChallenges: true };
type State = Readonly<typeof initialState>;

export default class LobbyPage extends React.PureComponent<Props, State> {
  readonly state: State = initialState;

  render() {
    const { newOpenGame, joinOpenGame } = this.props;
    const openGames = this.props.openGames || [];

    return (
      <ApplicationLayout>
        <div className="w-100">
          <div className="lobby-header">
            <a className="lobby-header-title">Games</a>
            <Button className="lobby-new-game" outline={true} onClick={newOpenGame}>
              Create a game
            </Button>
          </div>
          <div className="mt-5">
            <div className="lobby-ogc-container">
              {openGames.map(openGame => (
                  <OpenGameEntry key={openGame.address} openGame={openGame} joinOpenGame={joinOpenGame}/>
              ))}
            </div>
          </div>
        </div>
        <CreatingOpenGameContainer/>
      </ApplicationLayout >
    );
  }
}
