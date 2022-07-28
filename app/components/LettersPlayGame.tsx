import React from "react";
import Keyboard from "./Keyboard";
import LettersGrid from "./LettersGrid";
import GameProvider from "../context/gameContext";

function LettersPlayGame() {
	// TODO: Show popup if user wins/loses and asks to play again
	return (
		<GameProvider>
			<div className="flex flex-1 flex-col">
				<LettersGrid />
				<Keyboard />
			</div>
		</GameProvider>
	);
}

export default LettersPlayGame;
