import RockPaperScissorsGame  from './contracts/RockPaperScissorsGame.json';
import RockPaperScissorsState from './contracts/RockPaperScissorsState.json';

export const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:7545",
    },
  },
  contracts: [RockPaperScissorsState, RockPaperScissorsGame],
  events: {},
};