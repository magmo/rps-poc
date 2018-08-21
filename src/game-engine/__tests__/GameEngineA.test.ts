import ChannelWallet from '../../wallet/domain/ChannelWallet';
import * as ApplicationStatesA from '../application-states/PlayerA';
import * as GameEngine from '../GameEngine';
import { Play } from '../positions';

it('requires sufficient funds to choose a play', () => {
  const stake = 5;
  const initialBals = [2, 5];
  const wallet = new ChannelWallet();
  const channel = wallet.address;
  const adjudicator = '0x2718';

  const readyToChooseAPlay = new ApplicationStatesA.ReadyToChooseAPlay({
    channel,
    stake,
    balances: initialBals,
    adjudicator,
    turnNum: 4,
  })

  expect(readyToChooseAPlay).not.toBeNull()

  const gameEngineA = GameEngine.fromState({
    state: readyToChooseAPlay,
    wallet,
  })

  gameEngineA.choosePlay(Play.Rock);

  expect(gameEngineA.state instanceof ApplicationStatesA.InsufficientFundsA).toBe(true)
})