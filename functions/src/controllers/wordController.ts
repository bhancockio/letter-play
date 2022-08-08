import { Request, Response } from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { ALL_ENGLISH_FIVE_LETTERED_WORDS } from "../utils/words";
import { generateFirestoreUUID } from "../utils/database";
const GCLOUD_API_KEY = functions.config().gcloud.api_key;

const generateNewWordForDay = (req: Request, res: Response) => {
	functions.logger.log("Generating new word for day");

	if (req.body.API_KEY !== GCLOUD_API_KEY) {
		return res.status(403).json({ message: "You are not authorized to make this request" });
	}

	// Collect all words that have already been used
	return admin
		.firestore()
		.collection("words")
		.get()
		.then((snapshot) => {
			// Collect all words that have already been used in the app
			const words: string[] = [];
			snapshot.forEach((doc) => {
				words.push(doc.data().word);
			}),
				functions.logger.log("Got words", words);
			return words;
		})
		.then((existingWords: string[]) => {
			// Pick a new word for the day.
			const newWord = pickNewWordOfTheDay(existingWords);
			functions.logger.log("New word", newWord);
			return newWord;
		})
		.then((newWord: string) => {
			// Add the new word to the database
			const id = generateFirestoreUUID();
			return admin
				.firestore()
				.doc(`words/${id}`)
				.set({ word: newWord, created: new Date().toISOString(), id: id });
		})
		.then(() => {
			functions.logger.log("New word added to database");
			return res.status(204).json({ message: "New word added to database" });
		})
		.catch((err) => {
			functions.logger.error("Error adding new word to database");
			functions.logger.error(err);
			return res.status(500).json({ message: "Error adding new word to database" });
		});
};

const pickNewWordOfTheDay = (usedWord: string[]): string => {
	let newWord;
	while (!newWord) {
		newWord =
			ALL_ENGLISH_FIVE_LETTERED_WORDS[
				Math.floor(Math.random() * ALL_ENGLISH_FIVE_LETTERED_WORDS.length)
			];
		if (usedWord.includes(newWord)) {
			newWord = null;
		}
	}
	return newWord;
};

module.exports = {
	generateNewWordForDay
};
