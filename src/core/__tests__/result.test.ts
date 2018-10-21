import { Move } from '../moves';
import { Result, calculateResult } from '../results';

function testOutcome(yourMove: Move, theirMove: Move, expectedResult: Result) {
  it(`Gives ${Result[expectedResult]} when you play ${Move[yourMove]} and they play ${Move[theirMove]}`, () => {
    expect(calculateResult(yourMove, theirMove)).toEqual(expectedResult);
  });
}

describe('result', () => {
  testOutcome(Move.Rock, Move.Rock, Result.Tie);
  testOutcome(Move.Rock, Move.Paper, Result.YouLose);
  testOutcome(Move.Rock, Move.Scissors, Result.YouWin);
  testOutcome(Move.Paper, Move.Rock, Result.YouWin);
  testOutcome(Move.Paper, Move.Paper, Result.Tie);
  testOutcome(Move.Paper, Move.Scissors, Result.YouLose);
  testOutcome(Move.Scissors, Move.Rock, Result.YouLose);
  testOutcome(Move.Scissors, Move.Paper, Result.YouWin);
  testOutcome(Move.Scissors, Move.Scissors, Result.Tie);
});
