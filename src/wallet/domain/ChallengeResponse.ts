import { State as Position } from "fmg-core";
import { Signature, ConclusionProof } from ".";

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
  theirSignature: Signature;
  myPosition: Position;
  mySignature: Signature;

  constructor({ theirPosition, theirSignature, myPosition, mySignature }: { theirPosition: Position, theirSignature: Signature, myPosition: Position, mySignature: Signature,}) {
    this.theirPosition = theirPosition;
    this.theirSignature = theirSignature;
    this.myPosition = myPosition;
    this.mySignature = mySignature;
  }
}

export class Refute {
  theirPosition: Position;
  theirSignature: Signature;

  constructor({ theirPosition, theirSignature }: { theirPosition: Position, theirSignature: Signature }) {
    this.theirPosition = theirPosition;
    this.theirSignature = theirSignature;
  }
}

export class Conclude {
  conclusionProof: ConclusionProof;

  constructor({ conclusionProof }: { conclusionProof: ConclusionProof }) {
    this.conclusionProof = conclusionProof;
  }
}