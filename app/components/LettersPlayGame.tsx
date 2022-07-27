import React from "react";
import Keyboard from "./Keyboard";
import LettersGrid from "./LettersGrid";

function LettersPlayGame() {
	return (
		<div className="flex flex-1">
			<LettersGrid />
			<Keyboard />
		</div>
	);
}

export default LettersPlayGame;
