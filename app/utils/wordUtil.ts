export const isLetterInCorrectPositionInTargetWord = (
	letter: string,
	position: number,
	targetWord: string
) => {
	return targetWord[position].toLowerCase() === letter.toLowerCase();
};

export const isLetterInTargetWord = (letter: string, targetWord: string) => {
	console.log(`isLetterInTargetWord: ${letter} ${targetWord}`);
	return targetWord.toLowerCase().indexOf(letter.toLowerCase()) !== -1;
};
