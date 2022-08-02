import React from "react";
import Word from "./Word";

function LettersGrid() {
	return (
		<div className="flex flex-col flex-1 min-w-[341px]">
			{Array.from(Array(6).keys()).map((guessRowIndex: number) => (
				<Word key={guessRowIndex} guessRowIndex={guessRowIndex} />
			))}
		</div>
	);
}

export default LettersGrid;
