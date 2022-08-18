import {
	ALL_ENGLISH_FIVE_LETTERED_WORDS,
	INITIAL_GAME_STATE,
	MAXIMUM_GUESSES,
	MAXIMUM_LETTERS_IN_WORD
} from "../utils/constants";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { LetterGuess } from "../types/LetterGuess";
import { Message } from "../types/Message";
import { Stat } from "@backend/Stat";
import { fetchWordBasedOnPath } from "../utils/wordUtil";
import moment from "moment";
import { postStat } from "../utils/statUtil";
import { useRouter } from "next/router";
import { useUser } from "./userContext";

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
	stat?: Stat;
}

type GameContextType = {
	state: IGameState;
	setCurrentLetterIndex: (index: number) => void;
	handleKeyDown: (key: KeyboardEvent | string) => void;
};

export const GameContext = createContext<GameContextType>({} as GameContextType); // TODO: Currently doing this to avoid null issues

export default function GameContextComponent({ children }: { children?: ReactNode }) {
	const [gameState, setGameState] = useState<IGameState>(INITIAL_GAME_STATE);
	const router = useRouter();
	const { user } = useUser();

	useEffect(() => {
		const { asPath } = router;

		// Fetch target word from API
		setGameState((prevState) => ({
			...prevState,
			loading: true
		}));

		const fetchWordPromise = fetchWordBasedOnPath(asPath);
		fetchWordPromise
			.then((fetchedword) => {
				setGameState((previousState: IGameState) => ({
					...previousState,
					targetWord: fetchedword.word,
					puzzleNumber: fetchedword.puzzleNumber || -1,
					date: fetchedword.date,
					loading: false
				}));
			})
			.catch(() => {
				setGameState((previousState) => ({
					...previousState,
					targetWord: "",
					puzzleNumber: -1,
					loading: false
				}));
			});
	}, [router.query]);

	const setCurrentLetterIndex = (index: number) => {
		setGameState({
			...gameState,
			currentLetterIndex: index
		});
	};

	const handleKeyDown = async (event: KeyboardEvent | string) => {
		// Ignore keys if user has already won
		if (gameState.targetWordGuessed) return;

		const formattedKey: string = getNewFormattedKey(event);

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
					await postStat({
						userId: user?.uid,
						userName: user?.displayName,
						createdAt: moment().toISOString(),
						word: gameState.targetWord,
						guessedCorrectly: targetWordGuessed,
						numberOfGuesses: gameState.currentGuessCount + 1
					}).then((resp) => {
						console.log("post stat response", resp.data.data);
						setGameState((prevState) => ({
							...prevState,
							stat: resp.data.data
						}));
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

	// Handle multiple types of key presss sources
	// Convert key to lowercase for consistent checking
	const getNewFormattedKey = (event: KeyboardEvent | string): string => {
		if (event instanceof KeyboardEvent) {
			// Make sure that the spacebar doesn't scroll down the page.
			(event as KeyboardEvent).key === " " && (event as KeyboardEvent).preventDefault();
			return (event as KeyboardEvent).key?.toLowerCase();
		}
		return event?.toLowerCase();
	};

	const isValidGuessSubmission = (): { validSubmission: boolean; message: Message } => {
		// Make sure the user's guess doesn't contain empty characters/spaces
		if (gameState.currentGuess.includes(" ") || gameState.currentGuess.includes("")) {
			return {
				validSubmission: false,
				message: { show: true, text: "You have to have letters for each spot" }
			};
		}

		// Make sure the user guesses and english word
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
		<GameContext.Provider value={{ state: gameState, setCurrentLetterIndex, handleKeyDown }}>
			{children}
		</GameContext.Provider>
	);
}

export const useGame = () => useContext(GameContext);
