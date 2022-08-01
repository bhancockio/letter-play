import { createContext, useContext, useEffect, useState } from "react";
import { ALL_ENGLISH_FIVE_LETTERED_WORDS, MAXIMUM_LETTERS_IN_WORD } from "../utils/constants";
import { fetchWord } from "../utils/wordFetcher";
import Message from "../interfaces/Message";

export interface IGameState {
	targetWord: string;
	currentGuessCount: number;
	wordGuesses: string[];
	currentGuess: string[];
	currentLetterIndex: number;
	targetWordGuessed: boolean;
	lettersGuessed: string[];
	message: Message;
	submissionStatus: "normal" | "error";
}

export type GameContextType = {
	gameState: IGameState;
	setCurrentLetterIndex: (index: number) => void;
	handleKeyDown: (key: string) => void;
	setGameContext: (gameState: IGameState) => void;
};

export const GameContext = createContext<GameContextType | null>(null);

const INITIAL_GAME_STATE: IGameState = {
	targetWord: "",
	wordGuesses: Array(6).fill(""),
	currentGuess: Array(5).fill(""),
	currentGuessCount: 0,
	currentLetterIndex: 0,
	targetWordGuessed: false,
	lettersGuessed: [],
	message: { show: false },
	submissionStatus: "normal"
};

export default function GameContextComponent({ children }) {
	const [gameState, setGameState] = useState<IGameState>(INITIAL_GAME_STATE);

	const setGameContext = (newGameState: IGameState) => {
		setGameState({ ...gameState, ...newGameState });
	};

	const setCurrentLetterIndex = (index: number) => {
		setGameState({
			...gameState,
			currentLetterIndex: index
		});
	};

	const handleKeyDown = (newKey: string) => {
		// Convert keyboard inputs to lowercase for simplicity and consistency
		const formattedKey = newKey.toLowerCase();

		// handle submission
		const { validSubmission, message } = isValidGuessSubmission();

		if (formattedKey === "enter") {
			if (validSubmission) {
				// Show message
				if (userGuessedCorrectly()) {
					// Update game state to show that the user won
					setGameState((prevGameState) => ({
						...prevGameState,
						targetWordGuessed: true,
						submissionStatus: "normal",
						message: message
					}));
				} else {
					// Update game state to show that the user guessed incorrectly
					setGameState((prevGameState) => ({
						...prevGameState,
						currentGuessCount: prevGameState.currentGuessCount + 1,
						wordGuesses: prevGameState.wordGuesses.map((guess, index) => {
							if (index === prevGameState.currentGuessCount) {
								return prevGameState.currentGuess.join("") || "";
							}
							return guess;
						}),
						currentLetterIndex: 0,
						currentGuess: Array(5).fill(""), // Reset the current guess
						submissionStatus: "normal",
						message: message
					}));
				}
			} else {
				// Show message
				setGameState((prevGameState) => ({
					...prevGameState,
					submissionStatus: "error",
					message: message
				}));
			}
		}
		// Make sure that key is a letter
		else if (formattedKey.length === 1 && formattedKey.match(/[a-z\s]/i)) {
			// Update game state to show that the user guessed a letter
			setGameState((prevGameState) => ({
				...prevGameState,
				currentGuess: [
					...prevGameState.currentGuess.slice(0, prevGameState.currentLetterIndex),
					formattedKey.toUpperCase(),
					...prevGameState.currentGuess.slice(prevGameState.currentLetterIndex + 1)
				],
				currentLetterIndex: Math.min(
					prevGameState.currentLetterIndex + 1,
					MAXIMUM_LETTERS_IN_WORD - 1
				)
			}));
		} else if (formattedKey === "arrowleft") {
			setGameState((prevGameState) => ({
				...prevGameState,
				currentLetterIndex: Math.max(prevGameState.currentLetterIndex - 1, 0)
			}));
		} else if (formattedKey === "arrowright") {
			setGameState((prevGameState) => ({
				...prevGameState,
				currentLetterIndex: Math.min(
					prevGameState.currentLetterIndex + 1,
					MAXIMUM_LETTERS_IN_WORD - 1
				)
			}));
		} else if (formattedKey === "backspace" || formattedKey === "delete") {
			setGameState((prevGameState) => {
				const currentLetter = prevGameState.currentGuess[prevGameState.currentLetterIndex];
				const formattedKeyIndex =
					currentLetter === ""
						? Math.max(prevGameState.currentLetterIndex - 1, 0)
						: prevGameState.currentLetterIndex;

				return {
					...prevGameState,
					// Delete current character.
					currentGuess: [
						...prevGameState.currentGuess.slice(0, prevGameState.currentLetterIndex),
						"",
						...prevGameState.currentGuess.slice(prevGameState.currentLetterIndex + 1)
					],
					currentLetterIndex: formattedKeyIndex,
					submissionStatus: "normal",
					message: { show: false }
				};
			});
		}
	};

	// TODO: This wasn't linked to the state at before doing ghetto fix with keyboard
	// TODO: Make sure word is actually an english word.
	const isValidGuessSubmission = (): { validSubmission: boolean; message: Message } => {
		console.log("isValidGuessSubmission", gameState.currentGuess);
		// Make sure the user's guess doesn't contain empty characters/spaces
		if (gameState.currentGuess.includes(" ") || gameState.currentGuess.includes("")) {
			return {
				validSubmission: false,
				message: { show: true, text: "You have to have letters for each spot" }
			};
		}

		// Make sure the user guesses and english word
		// TODO: Can I memo this? This is a big check.
		const userGuess = gameState.currentGuess.join("").toLowerCase();
		if (!ALL_ENGLISH_FIVE_LETTERED_WORDS.includes(userGuess)) {
			return {
				validSubmission: false,
				message: {
					show: true,
					text: `${gameState.currentGuess.join("")} is not a valid word`
				}
			};
		}

		return { validSubmission: true, message: { show: false } };
	};

	const userGuessedCorrectly = (): boolean => {
		return gameState.currentGuess.join("") === gameState.targetWord;
	};

	useEffect(() => {
		console.log("game context loading");
		// Fetch target word from API
		fetchWord()
			.then((word) => {
				setGameState({ ...gameState, targetWord: word });
			})
			.catch(() => {
				setGameState({ ...gameState, targetWord: "" });
			});
	}, []);

	return (
		<GameContext.Provider
			value={{ gameState, setCurrentLetterIndex, handleKeyDown, setGameContext }}
		>
			{children}
		</GameContext.Provider>
	);
}

export const useGame = () => useContext(GameContext);
