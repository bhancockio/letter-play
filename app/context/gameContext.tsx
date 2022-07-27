import { createContext } from "vm";

export interface IGameContext {
	targetWord: string;
	words: Word[];
}

export const GameContext = createContext<IGameContext>(null);
