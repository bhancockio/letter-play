import React, { useEffect, useState } from "react";
import { useGame } from "../context/gameContext";
import LetterTile from "./LetterTile";

interface IWordProps {
	guessRowIndex: number;
}

function Word({ guessRowIndex }: IWordProps) {
	const { gameState } = useGame();
	const [word, setWord] = useState(Array(5).fill(""));

	useEffect(() => {
		// If current row has already been guessed, show the word.
		if (guessRowIndex < gameState.currentGuessCount) {
			const guess = gameState.wordGuesses[guessRowIndex];
			setWord(guess.split(""));
		} else if (guessRowIndex === gameState.currentGuessCount) {
			setWord(gameState.currentGuess);
		} else {
			// Otherwise, show the word with blanks.
			setWord(Array(5).fill(""));
		}
	}, [gameState]);

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
