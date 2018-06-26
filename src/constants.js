import Enum from 'enum';

import { brandColor } from './App.css';

export const BRAND_COLOR = brandColor;

export const ROUTE_PATHS = {
  HOW_IT_WORKS: 'how',
  PLAY: 'play',
  ABOUT: 'about',
};

export const GAME_STAGES = new Enum([
	// These map to the screens (bolded outlines)
	//    in the project's readme
	// Player A Setup states
	'INITIALIZE_SETUP',
	'CHOOSE_WAGER',
	'GAME_ACCEPT_RECEIVED',

	// Player B Setup states
	'WAITING_FOR_PREFUND_MESSAGE',
	'CONFIRM_WAGER',

	// Player A Play states
	

	// general states
	'WAITING_FOR_PLAYER_B',
	'WAITING_FOR_CHAIN',
	'GAME CANCELLED',

	// old states
  'SELECT_CHALLENGER',
  'SELECT_MOVE',
  'WAIT_FOR_OPPONENT_MOVE',
  'REVEAL_WINNER',
]);

export const MOVE_OPTIONS = [
  {
    name: 'ROCK',
    id: 0,
  },
  {
    name: 'PAPER',
    id: 1,
  },
  {
    name: 'SCISSORS',
    id: 2,
  },
];
