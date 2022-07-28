import React, { useEffect } from "react";
import { useGame } from "../context/gameContext";

function Keyboard() {
	const { gameState, handleKeyDown } = useGame();

	// Not a fan of reassigning event listeners everytime gamestate chnages.
	useEffect(() => {
		// Handle key presses
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [gameState]);

	return <div>Keyboard</div>;
}

export default Keyboard;
