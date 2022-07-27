import React from "react";
import Word from "./Word";

function LettersGrid() {
	return (
		<div className="flex-col">
			{/* Guesses */}
			{Array.from(Array(6).keys()).map((guessNumber: number) => (
				<Word key={guessNumber} guessNumber={guessNumber} />
			))}
		</div>
	);
}

export default LettersGrid;
