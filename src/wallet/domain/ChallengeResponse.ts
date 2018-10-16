import { State as Position } from "fmg-core";
import { ConclusionProof } from "./ConclusionProof";

export type ChallengeResponse = RespondWithMove | RespondWithExistingMove | RespondWithAlternativeMove | Refute | Conclude;

export class RespondWithMove {
}

export class RespondWithExistingMove{
  response?: Position;

  constructor({ response }: { response?: Position }) {
    this.response = response;
  }
}

export class RespondWithAlternativeMove {
  theirPosition: Position;
  myPosition: Position;

  constructor({ theirPosition, myPosition }: { theirPosition: Position, myPosition: Position }) {
    this.theirPosition = theirPosition;
    this.myPosition = myPosition;
  }
}

export class Refute {
  theirPosition: Position;

  constructor({ theirPosition }: { theirPosition: Position }) {
    this.theirPosition = theirPosition;
  }
}

export class Conclude {
  conclusionProof: ConclusionProof;

  constructor({ conclusionProof }: { conclusionProof: ConclusionProof }) {
    this.conclusionProof = conclusionProof;
  }
}