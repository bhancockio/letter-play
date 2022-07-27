export class Lettter {
	letter: string;
	targetLetter: string;
	guessSubmitted: boolean = false;

	constructor(letter: string, targetLetter: string) {
		this.letter = letter;
		this.targetLetter = targetLetter;
	}
}
