import axios from "axios";
import { Word } from "@backend/Word";

export const fetchRandomWord = (): Promise<string> => {
	const queryString = "?random=true";
	return fetchWord(queryString);
};

// Date is formatted as YYYY-MM-DD
export const fetchWordForToday = (): Promise<string> => {
	return fetchWord();
};

const fetchWord = (queryString: string = ""): Promise<string> => {
	return axios
		.get(`${process.env.NEXT_PUBLIC_FIREBASE_API_URL}/word${queryString ? queryString : ""}`)
		.then((resp) => {
			console.log(resp);
			return (resp.data?.data as Word).word;
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
	return targetWord[position].toLowerCase() === letter.toLowerCase();
};

export const isLetterInTargetWord = (letter: string, targetWord: string) => {
	return targetWord.toLowerCase().indexOf(letter.toLowerCase()) !== -1;
};
