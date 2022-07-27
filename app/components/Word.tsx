import React from "react";
import LetterTile from "./LetterTile";

function Word({ guessNumber: number }) {
	const word = "GAMES";
	return (
		<div className="grid grid-cols-5 gap-2 mb-2">
			{word.split("").map((letter, index) => (
				<LetterTile key={index} letter={letter} />
			))}
		</div>
	);
}

export default Word;
