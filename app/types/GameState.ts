// Questions:
// Would it be better to just use a class?
// Should I use context or redux?

export interface GameState {
	targetWord: string;
	currentGuessCount: number;
	wordGuesses: string[];
	currentLetterIndex: number;
}
