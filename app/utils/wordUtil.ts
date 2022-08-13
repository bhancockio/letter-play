import { IWord } from "@backend/IWord";
import axios from "axios";

export const fetchRandomWord = (): Promise<IWord> => {
	const queryString = "?random=true";
	return fetchWord(queryString);
};

// Date is formatted as YYYY-MM-DD
export const fetchWordForToday = (): Promise<IWord> => {
	return fetchWord();
};

const fetchWord = (queryString: string = ""): Promise<IWord> => {
	return axios
		.get(`${process.env.NEXT_PUBLIC_FIREBASE_API_URL}/word${queryString ? queryString : ""}`)
		.then((resp) => {
			return resp.data?.data as IWord;
		})
		.catch((err) => {
			console.error(err);
			return null;
		});
};

export const isLetterInCorrectPositionInTargetWord = (
	letter: string,
	position: number,
	targetWord: string
) => {
	return targetWord[position]?.toLowerCase() === letter.toLowerCase();
};

export const isLetterInTargetWord = (letter: string, targetWord: string) => {
	return targetWord.toLowerCase().indexOf(letter.toLowerCase()) !== -1;
};
