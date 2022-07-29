import React, { useEffect } from "react";
import { useGame } from "../context/gameContext";
import { KEYBOARD_KEYS } from "../utils/constants";

const KeyboardKey = (props) => {
	const baseKeyStyling =
		"bg-gray-200 font-bold py-4 mx-1 rounded-md text-center text-black pointer-cursor select-none";
	let width = "w-[45px]";

	// Handle special characters
	if (props.letter === "SPACE") {
		width = "w-[345px]";
	} else if (props.letter === "ENTER" || props.letter === "DELETE") {
		width = "w-[95px]";
	}

	return (
		<div className={`${baseKeyStyling} ${width}`} onClick={props.onClick}>
			{props.letter}
		</div>
	);
};

function Keyboard() {
	const { gameState, handleKeyDown } = useGame();

	// Reassigning event listeners everytime gamestate chnages.
	// TODO: See if this can be moved somehwere else
	useEffect(() => {
		const onKeyDown = (e) => {
			handleKeyDown(e.key);
		};
		// Handle key presses
		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [gameState]);

	return (
		<div className="flex flex-col">
			{KEYBOARD_KEYS.map((keyboardRow: any[], index: number) => {
				return (
					<div key={index} className="flex flex-row justify-center mb-1">
						{keyboardRow.map((keyValuePair) => (
							<KeyboardKey
								key={keyValuePair.key}
								letter={keyValuePair.key}
								onClick={() => handleKeyDown(keyValuePair.value)}
							/>
						))}
					</div>
				);
			})}
		</div>
	);
}

export default Keyboard;
