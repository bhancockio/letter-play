import { Word } from "../models/Word";

export class Letter {
	letter: string;
	targetLetter: string;
	isSelected: boolean;
	isCorrect: boolean;
	wordContainsLetter: boolean;
	parentWord: Word;
}
