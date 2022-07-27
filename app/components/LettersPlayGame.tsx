import React from "react";
import Keyboard from "./Keyboard";
import LettersGrid from "./LettersGrid";
import GameProvider from "../context/gameContext";

function LettersPlayGame() {
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
