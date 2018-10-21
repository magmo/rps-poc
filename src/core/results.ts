import { Move } from './moves';

export enum Result {
  Tie,
  YouWin,
  YouLose,
}

export function calculateResult(yourMove: Move, theirMove: Move): Result {
  const x = (yourMove - theirMove + 2) % 3;
  switch (x) {
    case 0:
      return Result.YouWin;
    case 1:
      return Result.YouLose;
    default:
      return Result.Tie;
  }
}
