import { createContext, useContext, useEffect, useState } from "react";
import { GameState } from "../types/GameState";
import { fetchWord } from "../utils/wordFetcher";

export const GameContext = createContext<GameState>(null);

export default function GameContextComponent({ children }) {
	const [gameState, setGameState] = useState<GameState>({
		targetWord: "",
		currentGuessCount: 0,
		wordGuesses: [],
		currentLetterIndex: 0
	});

	useEffect(() => {
		// Fetch target word from API
		fetchWord()
			.then((word) => {
				setGameState({ ...gameState, targetWord: word });
			})
			.catch(() => {
				setGameState({ ...gameState, targetWord: "" });
			});
	}, []);

	return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;
}

export const useGame = () => useContext(GameContext);
