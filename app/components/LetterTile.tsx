import React, { useEffect } from "react";
import { useGame } from "../context/gameContext";

function LetterTile({ letterIndex, letter, guessRowIndex }) {
	const { gameState, setCurrentLetterIndex } = useGame();
	const [isActiveLetter, setIsActiveLetter] = React.useState(false);

	// TODO: Talk to avery because this is regnenerating the entire grid everytime the active component is clicked
	useEffect(() => {
		setIsActiveLetter(
			letterIndex === gameState.currentLetterIndex &&
				guessRowIndex === gameState.currentGuessCount
		);
	}, [gameState, guessRowIndex, letterIndex]);

	useEffect(() => {
		if (isActiveLetter) console.log("Active letter:", letter);
	}, [isActiveLetter]);

	const handleClick = () => {
		// Only set the current letter if the user clicks the active word row.
		if (guessRowIndex === gameState.currentGuessCount) {
			setCurrentLetterIndex(letterIndex);
		}
	};

	return (
		<div
			onClick={handleClick}
			className={`w-full py-2 rounded-md text-center border-4 border-black text-3xl font-bold cursor-pointer ${
				isActiveLetter ? "border-dashed" : "border-solid"
			}`}
		>
			{letter ? letter : <span>&nbsp;&nbsp;</span>}
		</div>
	);
}

export default LetterTile;
