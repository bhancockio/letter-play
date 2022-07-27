import { createContext, useContext, useEffect, useState } from "react";
import { fetchWord } from "../utils/wordFetcher";

export interface IGameState {
	targetWord: string;
	currentGuessCount: number;
	wordGuesses: string[];
	currentLetterIndex: number;
}

export type GameContextType = {
	gameState: IGameState;
	setCurrentLetterIndex: (index: number) => void;
};

export const GameContext = createContext<GameContextType | null>(null);

export default function GameContextComponent({ children }) {
	const [gameState, setGameState] = useState<IGameState>({
		targetWord: "",
		currentGuessCount: 0,
		wordGuesses: Array(6).fill(""),
		currentLetterIndex: 0
	});

	const setCurrentLetterIndex = (index: number) => {
		setGameState({
			...gameState,
			currentLetterIndex: index
		});
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		// TODO: handle submission
		// TODO: Make sure that key is a letter
		// TODO: update current letter in guess word
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
