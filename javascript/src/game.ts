import { Player } from "./player";
import { Simulator } from "./simulator";

export class Game {
  rockQuestions: string[] = [];
  sportsQuestions: string[] = [];
  scienceQuestions: string[] = [];
  popQuestions: string[] = [];

  players: Player[] = [];
  currentPlayer: number = 0;

  constructor() {
    for (let i = 0; i < 50; i++) {
      this.popQuestions.push("Pop Question " + i);
      this.scienceQuestions.push("Science Question " + i);
      this.sportsQuestions.push("Sports Question " + i);
      this.rockQuestions.push(this.createRockQuestion(i));
    }
  }

  add(playerName) {
    this.players.push(new Player(playerName));
    console.log(`They are player number ${this.players.length}`);
  }

  currentCategory() {
    switch (this.getCurrentPlayer().place) {
      case 0:
      case 4:
      case 8: {
        return "Pop";
      }
      case 1:
      case 5:
      case 9: {
        return "Science";
      }
      case 2:
      case 6:
      case 10: {
        return "Sports";
      }
    }
    return "Rock";
  }

  askQuestion() {
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

  createRockQuestion(index) {
    return `Rock Question ${index}`;
  }

  roll(roll): boolean {
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

  _movePlayerAndAskQuestion(roll) {
    this.getCurrentPlayer().moveForward(roll);
    this.askQuestion();
  }

  correctAnswer() {
    console.log("Answer was correct!!!!");

    this.getCurrentPlayer().increaseAGoldCoin();
    return this.didCurrentPlayerWin();
  }

  wrongAnswer() {
    console.log("Question was incorrectly answered");
    this.getCurrentPlayer().sentToPenaltyBox();

    return true;
  }

  setNextPlayer() {
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

  start(simulator: Simulator): void {
    let notAWinner = false;

    do {
      const rolling = simulator.simulateRolling();
      const isCorrectAnswer = simulator.simulateAnswering();

      const shouldAnswerQuestionThisRound = this.roll(rolling);
      if (shouldAnswerQuestionThisRound) {
        notAWinner = isCorrectAnswer
          ? this.wrongAnswer()
          : this.correctAnswer();
      }
      this.setNextPlayer();
    } while (notAWinner);
  }
}
