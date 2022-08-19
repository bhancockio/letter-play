import { Word } from "@backend/Word";
import axios from "axios";

export const fetchWordBasedOnPath = (queryString: string = ""): Promise<Word> => {
	const formattedQueryString = queryString.replace("/", "");
	return axios
		.get(
			`${process.env.NEXT_PUBLIC_FIREBASE_API_URL}/word${
				formattedQueryString ? formattedQueryString : ""
			}`
		)
		.then((resp) => {
			return resp.data?.data as Word;
		})
		.catch((err) => {
			console.error(err);
			throw new Error(err);
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
