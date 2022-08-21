import { KEYBOARD_KEYS, KeyboardKeyValuePair } from "../utils/constants";
import React, { useEffect } from "react";

import { LetterGuess } from "../types/LetterGuess";
import { useGame } from "../context/gameContext";

interface IKeyboardKeyProps {
	letter: string;
	onClick: () => void;
	lettersGuessed: Map<string, LetterGuess> | undefined;
}

const KeyboardKey = ({ letter, onClick, lettersGuessed }: IKeyboardKeyProps) => {
	const baseKeyStyling =
		"font-bold py-3 sm:py-4 mx-[2px] rounded-md text-center pointer-cursor select-none";
	let width = "w-[45px]";
	let backgroundColor = "bg-gray-200";
	let textColor = "text-black";

	// Handle special characters
	if (letter === "SPACE") {
		width = "w-[345px]";
	} else if (letter === "ENTER" || letter === "DELETE") {
		width = "w-[95px]";
	}

	// Handle letters that have been guessed
	const lettterGuessed = lettersGuessed?.get(letter);
	if (lettterGuessed) {
		textColor = "text-white";
		if (lettterGuessed.inCorrectSpot) {
			backgroundColor = "bg-green-500";
		} else if (lettterGuessed.inWord) {
			backgroundColor = "bg-orange-400";
		} else {
			backgroundColor = "bg-gray-500";
		}
	}

	return (
		<div
			className={`${baseKeyStyling} ${width} ${backgroundColor} ${textColor}`}
			onClick={onClick}
		>
			{letter}
		</div>
	);
};

function Keyboard() {
	const game = useGame();

	const { handleKeyDown } = game;
	const { lettersGuessed, gameOver } = game.state;

	if (gameOver) {
		return null;
	}

	return (
		<div className="flex flex-col">
			{KEYBOARD_KEYS.map((keyboardRow: KeyboardKeyValuePair[], index: number) => (
				<div key={index} className="flex flex-row justify-center mb-1">
					{keyboardRow.map((keyValuePair) => (
						<KeyboardKey
							lettersGuessed={lettersGuessed}
							key={keyValuePair.key}
							letter={keyValuePair.key}
							onClick={() => handleKeyDown(keyValuePair.value)}
						/>
					))}
				</div>
			))}
		</div>
	);
}

export default Keyboard;
