import React, { useEffect } from "react";
import { isLetterInCorrectPositionInTargetWord, isLetterInTargetWord } from "../utils/wordUtil";

import { useGame } from "../context/gameContext";

interface ILetterTilerProps {
	letterIndex: number;
	letter: string;
	guessRowIndex: number;
}

function LetterTile({ letterIndex, letter, guessRowIndex }: ILetterTilerProps) {
	const { gameState, setCurrentLetterIndex } = useGame();
	const { submissionStatus } = gameState;
	const [isActiveLetter, setIsActiveLetter] = React.useState(false);

	useEffect(() => {
		setIsActiveLetter(
			letterIndex === gameState.currentLetterIndex &&
				guessRowIndex === gameState.currentGuessCount
		);
	}, [gameState, guessRowIndex, letterIndex]);

	const handleClick = () => {
		// Only set the current letter if the user clicks the active word row.
		if (guessRowIndex === gameState.currentGuessCount) {
			setCurrentLetterIndex(letterIndex);
		}
	};

	const getTileStyle = () => {
		if (guessRowIndex < gameState.currentGuessCount) {
			// Letter is in the correct spot
			if (isLetterInCorrectPositionInTargetWord(letter, letterIndex, gameState.targetWord)) {
				return "bg-green-500 border-green-500 text-white";
			}

			// Letter is in the target word but in the wrong spot
			if (isLetterInTargetWord(letter, gameState.targetWord)) {
				return "bg-orange-400 border-orange-400 text-white";
			}
			// Letter is not in the target word
			return "bg-gray-500 border-gray-500 text-white";
		}

		if (guessRowIndex === gameState.currentGuessCount && submissionStatus === "error") {
			return "bg-white border-red-500 text-red-500";
		}
		// Letter is currently being guessed or will be guesed in the future
		return "border-black text-black";
	};

	const getLetter = () => {
		if (letter) {
			return letter === " " ? <span>&#8211;</span> : <span>{letter}</span>;
		}
		return <span>&nbsp;&nbsp;</span>;
	};

	return (
		<div
			onClick={handleClick}
			className={`
			w-full 
			font-bold 
			rounded-md 
			text-center 
			cursor-pointer
			py-1 
			border-2 
			min-w-[50px]
			sm:min-w-[55px]
			sm:py-2 
			smborder-4 
			text-3xl 
			 ${isActiveLetter ? "border-dashed" : "border-solid"} ${getTileStyle()}`}
		>
			{getLetter()}
		</div>
	);
}

export default LetterTile;
