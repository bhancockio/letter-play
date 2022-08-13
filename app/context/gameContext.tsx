import {
	ALL_ENGLISH_FIVE_LETTERED_WORDS,
	MAXIMUM_GUESSES,
	MAXIMUM_LETTERS_IN_WORD
} from "../utils/constants";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchRandomWord, fetchWordForToday } from "../utils/wordUtil";

import { IWord } from "@backend/IWord";
import LetterGuess from "../interfaces/LetterGuess";
import Message from "../interfaces/Message";
import moment from "moment";
import { postStats } from "../utils/statsUtil";
import { useRouter } from "next/router";

export interface IGameState {
	targetWord: string;
	puzzleNumber: number;
	currentGuessCount: number;
	gameOver: boolean;
	wordGuesses: string[];
	currentGuess: string[];
	currentLetterIndex: number;
	targetWordGuessed: boolean;
	message: Message;
	submissionStatus: "normal" | "error";
	lettersGuessed: Map<string, LetterGuess>;
	date?: string;
	loading: boolean;
}

export type GameContextType = {
	gameState: IGameState;
	setCurrentLetterIndex: (index: number) => void;
	handleKeyDown: (key: KeyboardEvent) => void;
	setGameContext: (gameState: IGameState) => void;
};

export const GameContext = createContext<GameContextType | null>(null);

const INITIAL_GAME_STATE: IGameState = {
	targetWord: "",
	puzzleNumber: null,
	wordGuesses: Array(MAXIMUM_GUESSES).fill(""),
	currentGuess: Array(MAXIMUM_LETTERS_IN_WORD).fill(""),
	currentGuessCount: 0,
	gameOver: false,
	currentLetterIndex: 0,
	targetWordGuessed: false,
	message: { show: false },
	submissionStatus: "normal",
	lettersGuessed: new Map<string, LetterGuess>(),
	loading: false
};

export default function GameContextComponent({ children }) {
	const [gameState, setGameState] = useState<IGameState>(INITIAL_GAME_STATE);
	const router = useRouter();

	useEffect(() => {
		const { asPath } = router;

		// Fetch target word from API
		setGameState((prevState) => ({
			...prevState,
			loading: true
		}));
		const fetchWordPromise: Promise<IWord> =
			asPath === "/?random=true" ? fetchRandomWord() : fetchWordForToday();
		fetchWordPromise
			.then((fetchedword) => {
				console.log("fetchedword", fetchedword);
				setGameState((previousState) => ({
					...previousState,
					targetWord: fetchedword.word,
					puzzleNumber: fetchedword.puzzleNumber,
					date: fetchedword.date,
					loading: false
				}));
			})
			.catch(() => {
				setGameState((previousState) => ({
					...previousState,
					targetWord: "",
					puzzleNumber: null,
					loading: false
				}));
			});
	}, [router.query]);

	const setGameContext = (newGameState: IGameState) => {
		setGameState({ ...gameState, ...newGameState });
	};

	const setCurrentLetterIndex = (index: number) => {
		setGameState({
			...gameState,
			currentLetterIndex: index
		});
	};

	const handleKeyDown = async (event: KeyboardEvent) => {
		// Ignore keys if user has already won
		if (gameState.targetWordGuessed) return;

		const newKey = event.key;

		// Make sure that the spacebar doesn't scroll down the page.
		event.key === " " && event.preventDefault();
		// Convert keyboard inputs to lowercase for simplicity and consistency
		const formattedKey = newKey?.toLowerCase() || "";
		// handle submission
		const { validSubmission, message } = isValidGuessSubmission();

		if (formattedKey === "enter") {
			if (validSubmission) {
				// Update keyboard
				updateKeyboardBasedOnGuess();

				const targetWordGuessed = userGuessedCorrectly();
				const gameOver =
					gameState.currentGuessCount + 1 === MAXIMUM_GUESSES || targetWordGuessed;

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
					gameOver: gameOver,
					currentGuess: Array(5).fill(""), // Reset the current guess
					submissionStatus: "normal",
					targetWordGuessed: targetWordGuessed,
					message: message
				}));

				if (gameOver) {
					await postStats({
						createdAt: moment().toISOString(),
						word: gameState.targetWord,
						guessedCorrectly: targetWordGuessed,
						numberOfGuesses: gameState.currentGuessCount + 1
					});
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
		// Make sure that key is a letter or space
		else if (formattedKey.length === 1 && formattedKey.match(/[a-z\s]/i)) {
			// make sure space doesn't scroll down on the page.

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
		return gameState.currentGuess.join("").toLowerCase() === gameState.targetWord.toLowerCase();
	};

	const updateKeyboardBasedOnGuess = () => {
		gameState.currentGuess.forEach((letter, index) => {
			// If the letter was already guessed properly, don't change the keyboard
			const letterGuess = gameState.lettersGuessed.get(letter);
			if (letterGuess && letterGuess.inCorrectSpot) {
				return;
			}

			// Update the letter if it's in the word
			else if (gameState.targetWord.toUpperCase().includes(letter)) {
				// check to see if the letter is in the correct spot or not
				const inCorrectSpot = gameState.targetWord.toUpperCase().indexOf(letter) === index;
				setGameState((prevGameState) => ({
					...prevGameState,
					lettersGuessed: new Map(
						prevGameState.lettersGuessed.set(letter, {
							inWord: true,
							inCorrectSpot: inCorrectSpot
						})
					)
				}));
			} else {
				// Update the letter if it's not in the word
				setGameState((prevGameState) => ({
					...prevGameState,
					lettersGuessed: new Map(
						prevGameState.lettersGuessed.set(letter, {
							inWord: false,
							inCorrectSpot: false
						})
					)
				}));
			}
		});
	};

	return (
		<GameContext.Provider
			value={{ gameState, setCurrentLetterIndex, handleKeyDown, setGameContext }}
		>
			{children}
		</GameContext.Provider>
	);
}

export const useGame = () => useContext(GameContext);
