import React from "react";
import Word from "./Word";

function LettersGrid() {
	return (
		<div className="flex-col">
			{Array.from(Array(6).keys()).map((guessRowIndex: number) => (
				<Word key={guessRowIndex} guessRowIndex={guessRowIndex} />
			))}
		</div>
	);
}

export default LettersGrid;
