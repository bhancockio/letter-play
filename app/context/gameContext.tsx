import { createContext, useContext, useEffect, useState } from "react";
import { ALL_ENGLISH_FIVE_LETTERED_WORDS, MAXIMUM_LETTERS_IN_WORD } from "../utils/constants";
import { fetchWord } from "../utils/wordFetcher";

export interface IGameState {
	targetWord: string;
	currentGuessCount: number;
	wordGuesses: string[];
	currentGuess: string[];
	currentLetterIndex: number;
	targetWordGuessed: boolean;
	lettersGuessed: string[];
}

export type GameContextType = {
	gameState: IGameState;
	setCurrentLetterIndex: (index: number) => void;
	handleKeyDown: (event: KeyboardEvent) => void;
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
	lettersGuessed: []
};

export default function GameContextComponent({ children }) {
	const [gameState, setGameState] = useState<IGameState>(INITIAL_GAME_STATE);

	useEffect(() => {
		console.log("New game state:", gameState);
	}, [gameState]);

	const setGameContext = (newGameState: IGameState) => {
		setGameState({ ...gameState, ...newGameState });
	};

	const setCurrentLetterIndex = (index: number) => {
		setGameState({
			...gameState,
			currentLetterIndex: index
		});
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		// console.log("Current game state: ", currentGameState);
		const newLetter = e.key;
		console.log("newLetter", newLetter);
		// handle submission
		if (newLetter === "Enter" && isValidGuessSubmission()) {
			if (userGuessedCorrectly()) {
				// Update game state to show that the user won
				setGameState({
					...gameState,
					targetWordGuessed: true
				});
			} else {
				// Update game state to show that the user guessed incorrectly
				setGameState((prevGameState) => ({
					...gameState,
					currentGuessCount: prevGameState.currentGuessCount + 1,
					wordGuesses: prevGameState.wordGuesses.map((guess, index) => {
						if (index === prevGameState.currentGuessCount) {
							return prevGameState.currentGuess.join("") || "";
						}
						return guess;
					}),
					currentLetterIndex: 0,
					currentGuess: Array(5).fill("") // Reset the current guess
				}));
			}
		}
		// Make sure that key is a letter
		else if (newLetter.length === 1 && newLetter.match(/[a-z\s]/i)) {
			console.log("New letter clicked: " + newLetter);
			// Update game state to show that the user guessed a letter
			setGameState((prevGameState) => ({
				...prevGameState,
				currentGuess: [
					...prevGameState.currentGuess.slice(0, prevGameState.currentLetterIndex),
					newLetter.toUpperCase(),
					...prevGameState.currentGuess.slice(prevGameState.currentLetterIndex + 1)
				],
				currentLetterIndex: Math.min(
					prevGameState.currentLetterIndex + 1,
					MAXIMUM_LETTERS_IN_WORD - 1
				)
			}));
		} else if (newLetter === "ArrowLeft") {
			setGameState((prevGameState) => ({
				...prevGameState,
				currentLetterIndex: Math.max(prevGameState.currentLetterIndex - 1, 0)
			}));
		} else if (newLetter === "ArrowRight") {
			setGameState((prevGameState) => ({
				...prevGameState,
				currentLetterIndex: Math.min(
					prevGameState.currentLetterIndex + 1,
					MAXIMUM_LETTERS_IN_WORD - 1
				)
			}));
		} else if (newLetter === "Backspace") {
			setGameState((prevGameState) => {
				const currentLetter = prevGameState.currentGuess[prevGameState.currentLetterIndex];
				const newLetterIndex =
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
					currentLetterIndex: newLetterIndex
				};
			});
		}
	};

	// TODO: This wasn't linked to the state at before doing ghetto fix with keyboard
	// TODO: Make sure word is actually an english word.
	const isValidGuessSubmission = (): boolean => {
		console.log("isValidGuessSubmission", gameState.currentGuess);
		// Make sure the user's guess doesn't contain empty characters/spaces
		if (gameState.currentGuess.includes(" ") || gameState.currentGuess.includes("")) {
			return false;
		}

		// Make sure the user guesses and english word
		// TODO: Can I memo this? This is a big check.
		const userGuess = gameState.currentGuess.join("").toLowerCase();
		if (!ALL_ENGLISH_FIVE_LETTERED_WORDS.includes(userGuess)) {
			return false;
		}

		return true;
	};

	const userGuessedCorrectly = (): boolean => {
		console.log("Game state", gameState);
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
