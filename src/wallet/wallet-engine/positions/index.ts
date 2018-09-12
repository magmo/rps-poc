import PreFunding from './PreFunding';
import Error from './Error';
import AdjudicatorReceived from './AdjudicatorReceived';
import Default from './Default';

export { PreFunding, Error, AdjudicatorReceived };

export type Position = PreFunding | Error | AdjudicatorReceived | Default;
