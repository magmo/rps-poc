import {
  AdjudicatorExists,
  adjudicatorExists,
  AdjudicatorExistsParams,
} from './shared';

// both the stage and the state type. 
// TODO: this is potentially confusing - should fix
export const RUNNING = 'RUNNING';

interface Running extends AdjudicatorExists {
  type: typeof RUNNING;
  stage: typeof RUNNING;

}


export function running(params: AdjudicatorExistsParams): Running {
  return { type: RUNNING, stage: RUNNING, ...adjudicatorExists(params) };
}

export type RunningState = (
  | Running
);
