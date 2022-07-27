import { Lettter } from "./Letter";

export class Game {
	guessWord: string;
	targetWord: string;
	activeLetterIndex: number = 0;

	constructor(guessWord, targetWord) {
		this.guessWord = guessWord;
		this.targetWord = targetWord;
	}

	private initializeLettersInWord() {}
}
