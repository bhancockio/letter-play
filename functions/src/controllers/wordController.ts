import { Request, Response } from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { ALL_ENGLISH_FIVE_LETTERED_WORDS } from "../utils/words";
import { generateFirestoreUUID } from "../utils/database";
import { Word } from "../types/Word";
const GCLOUD_API_KEY = functions.config().gcloud.api_key;
const moment = require("moment");

const generateNewWordForDay = async (req: Request, res: Response) => {
	functions.logger.log("Generating new word for day");

	if (req.body.API_KEY !== GCLOUD_API_KEY) {
		return res.status(403).json({ message: "You are not authorized to make this request" });
	}

	// Collect all words that have already been used
	const currentDate = moment().format("YYYY-MM-DD");
	const existingWordsOfTheDay: Word[] = await admin
		.firestore()
		.collection("words")
		.get()
		.then((snapshot): Word[] => {
			// Collect all words that have already been used in the app
			const words: Word[] = [];
			if (snapshot.empty) return [];
			snapshot.forEach((doc) => {
				words.push(doc.data() as Word);
			});
			return words;
		})
		.catch((error): Word[] => {
			functions.logger.error("Error collecting words of the day");
			functions.logger.error(error);
			return [] as Word[];
		});

	// Check to make sure that a word wasn't already picked for the day
	for (let i = 0; i < existingWordsOfTheDay.length; i++) {
		const wordOfTheDay = existingWordsOfTheDay[i];
		if (wordOfTheDay.date === currentDate) {
			return res.status(400).json({ message: "Word already added for today" });
		}
	}

	// Pick a new word for the day.
	const newWord = pickNewWordOfTheDay(existingWordsOfTheDay);
	functions.logger.log("New word", newWord);

	// Add the new word to the database
	const id = generateFirestoreUUID();
	return admin
		.firestore()
		.doc(`words/${id}`)
		.set({ word: newWord, date: moment().format("YYYY-MM-DD"), id: id })
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

const pickNewWordOfTheDay = (previousWordsOfTheDay: Word[]): string => {
	let newWord;
	const previousWords = previousWordsOfTheDay.map((wordOfTheDay: Word) => wordOfTheDay.word);
	// Make sure that we don't pick a previously used word.
	while (!newWord) {
		newWord =
			ALL_ENGLISH_FIVE_LETTERED_WORDS[
				Math.floor(Math.random() * ALL_ENGLISH_FIVE_LETTERED_WORDS.length)
			];
		if (previousWords.includes(newWord)) {
			newWord = null;
		}
	}
	return newWord;
};

module.exports = {
	generateNewWordForDay
};
