export type Stat = {
	id?: string;
	userId?: string;
	userName?: string;
	word: string;
	guessedCorrectly: boolean;
	numberOfGuesses: number;
	createdAt: string;
};
