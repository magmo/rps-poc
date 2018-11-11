import {
  AdjudicatorExists,
  adjudicatorExists,
  AdjudicatorExistsParams,
} from './shared';

export const RUNNING = 'RUNNING';

interface Running extends AdjudicatorExists { name: typeof RUNNING; }


export function running(params: AdjudicatorExistsParams): Running {
  return { name: RUNNING, ...adjudicatorExists(params) };
}

export type RunningState = (
  | Running
);
