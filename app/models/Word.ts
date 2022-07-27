import { MAXIMUM_LETTERS_IN_WORD } from "../constants";

export class Word {
	guessWord: string;
	targetWord: string;
	activeLetterIndex: number = 0;
	guessSubmitted: boolean = false;
	lettersInWord: Letter[];

	constructor(guessWord, targetWord) {
		this.guessWord = guessWord;
		this.targetWord = targetWord;
	}

	private initializeLettersInWord() {}

	// TODO: Add a method to check if the guess is correct
	isGuessWordAValidEnglishWord(): boolean {
		return true;
	}

	isGuessCorrect(): boolean {
		return this.targetWord === this.guessWord;
	}

	incrementActiveLetterIndex() {
		if (this.activeLetterIndex < MAXIMUM_LETTERS_IN_WORD - 1) {
			this.activeLetterIndex++;
		}
	}

	decrementActiveLetterIndex() {
		if (this.activeLetterIndex > 0) {
			this.activeLetterIndex--;
		}
	}
}
