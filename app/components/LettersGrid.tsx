import React from "react";
import { useGame } from "../context/gameContext";
import Word from "./Word";

function LettersGrid() {
	const gameState = useGame();
	console.log("GameState", gameState);
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
