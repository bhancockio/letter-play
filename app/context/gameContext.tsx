import { createContext, useContext, useEffect, useState } from "react";
import { MAXIMUM_LETTERS_IN_WORD } from "../constants";
import { fetchWord } from "../utils/wordFetcher";

export interface IGameState {
	targetWord: string;
	currentGuessCount: number;
	wordGuesses: string[];
	currentGuess: string[];
	currentLetterIndex: number;
	targetWordGuessed: boolean;
}

export type GameContextType = {
	gameState: IGameState;
	setCurrentLetterIndex: (index: number) => void;
};

export const GameContext = createContext<GameContextType | null>(null);

const INITIAL_GAME_STATE: IGameState = {
	targetWord: "",
	wordGuesses: Array(6).fill(Array(5).fill("")), // TODO: See if I can remove this and just make it a row of guesses
	currentGuess: Array(5).fill(""),
	currentGuessCount: 0,
	currentLetterIndex: 0,
	targetWordGuessed: false
};

export default function GameContextComponent({ children }) {
	const [gameState, setGameState] = useState<IGameState>(INITIAL_GAME_STATE);

	const setCurrentLetterIndex = (index: number) => {
		setGameState({
			...gameState,
			currentLetterIndex: index
		});
	};

	const handleKeyDown = (e: KeyboardEvent) => {
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
				setGameState({
					...gameState,
					currentGuessCount: gameState.currentGuessCount + 1,
					currentGuess: Array(5).fill("") // Reset the current guess
				});
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

	const isValidGuessSubmission = (): boolean => {
		return true;
	};

	const userGuessedCorrectly = (): boolean => {
		return true;
	};

	useEffect(() => {
		// Fetch target word from API
		fetchWord()
			.then((word) => {
				setGameState({ ...gameState, targetWord: word });
			})
			.catch(() => {
				setGameState({ ...gameState, targetWord: "" });
			});

		// Handle key presses
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<GameContext.Provider value={{ gameState, setCurrentLetterIndex }}>
			{children}
		</GameContext.Provider>
	);
}

export const useGame = () => useContext(GameContext);
