import React, { useEffect, useState } from "react";

import LetterTile from "./LetterTile";
import { useGame } from "../context/gameContext";

interface IWordProps {
	guessRowIndex: number;
}

function Word({ guessRowIndex }: IWordProps) {
	const game = useGame();
	const { currentGuessCount = 0, wordGuesses, currentGuess } = game.state;
	const [word, setWord] = useState(Array(5).fill(""));

	useEffect(() => {
		// If current row has already been guessed, show the word.
		if (guessRowIndex < currentGuessCount) {
			const guess = wordGuesses[guessRowIndex];
			setWord(guess.split(""));
		} else if (guessRowIndex === currentGuessCount) {
			setWord(currentGuess);
		} else {
			// Otherwise, show the word with blanks.
			setWord(Array(5).fill(""));
		}
	}, [game.state]);

	return (
		<div className="grid grid-cols-5 gap-1 mx-auto sm:max-w-max sm:gap-2 mb-1 sm:mb-2">
			{/* eslint-disable react/no-array-index-key */}
			{word.map((letter, index) => (
				<LetterTile
					key={index}
					letterIndex={index}
					letter={letter}
					guessRowIndex={guessRowIndex}
				/>
			))}
		</div>
	);
}

export default Word;
