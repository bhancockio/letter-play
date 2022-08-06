export const isLetterInCorrectPositionInTargetWord = (
	letter: string,
	position: number,
	targetWord: string
) => {
	return targetWord[position].toLowerCase() === letter.toLowerCase();
};

export const isLetterInTargetWord = (letter: string, targetWord: string) => {
	return targetWord.toLowerCase().indexOf(letter.toLowerCase()) !== -1;
};
