import { Player } from "./domain/player";
import { Simulator } from "./simulator";
import { GameConfig } from "./game-config";

export class Game {
  rockQuestions: string[] = [];
  sportsQuestions: string[] = [];
  scienceQuestions: string[] = [];
  popQuestions: string[] = [];
  historyQuestions: string[] = [];

  players: Player[] = [];
  currentPlayer: number = 0;

  constructor() {
    for (let i = 0; i < 50; i++) {
      this.popQuestions.push("Pop Question " + i);
      this.scienceQuestions.push("Science Question " + i);
      this.sportsQuestions.push("Sports Question " + i);
      this.historyQuestions.push("History Question " + i);
      this.rockQuestions.push(this.createRockQuestion(i));
    }
  }

  add(playerName) {
    this.players.push(new Player(playerName));
    console.log(`They are player number ${this.players.length}`);
  }

  start(simulator: Simulator): void {
    let notAWinner = false;

    do {
      const rolling = simulator.simulateRolling();
      const isWrongAnswer = simulator.simulateAnswering();

      const shouldAnswerQuestionThisRound = this.roll(rolling);
      if (shouldAnswerQuestionThisRound) {
        notAWinner = isWrongAnswer ? this.wrongAnswer() : this.correctAnswer();
      }
      this.setNextPlayer();
    } while (notAWinner);
  }

  private currentCategory() {
    const questionTypes = ["Pop", "Science", "Sports", "Rock"];
    return questionTypes[this.getCurrentPlayer().place % questionTypes.length];
  }

  private askQuestion() {
    console.log(`The category is ${this.currentCategory()}`);
    if (this.currentCategory() == "Pop") {
      console.log(this.popQuestions.shift());
    }
    if (this.currentCategory() == "Science") {
      console.log(this.scienceQuestions.shift());
    }
    if (this.currentCategory() == "Sports") {
      console.log(this.sportsQuestions.shift());
    }
    if (this.currentCategory() == "Rock") {
      console.log(this.rockQuestions.shift());
    }
  }

  private createRockQuestion(index) {
    return `Rock Question ${index}`;
  }

  private roll(roll): boolean {
    console.log(`${this.getCurrentPlayerName()} is the current player`);
    console.log(`They have rolled a ${roll}`);

    if (this.getCurrentPlayer().isInPenaltyBox) {
      if (roll % 2 != 0) {
        this.getCurrentPlayer().freedFromPenaltyBox();
        this._movePlayerAndAskQuestion(roll);
        return true;
      } else {
        console.log(
          `${this.getCurrentPlayerName()} is not getting out of the penalty box`
        );
        return false;
      }
    } else {
      this._movePlayerAndAskQuestion(roll);
      return true;
    }
  }

  private _movePlayerAndAskQuestion(roll) {
    this.getCurrentPlayer().moveForward(roll);
    this.askQuestion();
  }

  private correctAnswer() {
    console.log("Answer was correct!!!!");

    this.getCurrentPlayer().increaseAGoldCoin();
    return this.didCurrentPlayerWin();
  }

  private wrongAnswer() {
    console.log("Question was incorrectly answered");
    this.getCurrentPlayer().sentToPenaltyBox();

    return true;
  }

  private setNextPlayer() {
    this.currentPlayer += 1;
    if (this.currentPlayer == this.players.length) {
      this.currentPlayer = 0;
    }
  }

  private didCurrentPlayerWin() {
    return this.getCurrentPlayer().didWin();
  }

  private getCurrentPlayer(): Player {
    return this.players[this.currentPlayer];
  }

  private getCurrentPlayerName() {
    return this.getCurrentPlayer().name;
  }
}
