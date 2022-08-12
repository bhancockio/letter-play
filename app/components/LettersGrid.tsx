import React from "react";
import Word from "./Word";

function LettersGrid() {
	return (
		<div className="flex flex-col flex-1 sm:mt-12 mx-auto min-w-[290px] max-w-[400px]">
			{Array.from(Array(6).keys()).map((guessRowIndex: number) => (
				<Word key={guessRowIndex} guessRowIndex={guessRowIndex} />
			))}
		</div>
	);
}

export default LettersGrid;
