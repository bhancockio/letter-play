import { Request, Response } from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { ALL_ENGLISH_FIVE_LETTERED_WORDS } from "../utils/words";
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

	// Find puzzle count
	const puzzleNumber = existingWordsOfTheDay.filter((word) => !!word.date).length + 1;

	// Add the new word to the database
	return admin
		.firestore()
		.doc(`words/${newWord}`)
		.set({ word: newWord, date: moment().format("YYYY-MM-DD"), puzzleNumber: puzzleNumber })
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

const getWord = (req: Request, res: Response) => {
	// By default, fetch the word of the day unless the user requests a random word.
	const random = !!req.query.random;

	const wordPromise = random ? getRandomWord() : getWordOfTheDay();
	return wordPromise
		.then((word) => {
			return res
				.status(200)
				.json({ message: "Successfully fetched word", data: { word: word } });
		})
		.catch((error) => {
			functions.logger.error("Error fetching word");
			functions.logger.error(error);
			return res.status(500).json({ message: "Something went wrong fetching the word" });
		});
};

const getRandomWord = async (): Promise<string> => {
	const randomWord =
		ALL_ENGLISH_FIVE_LETTERED_WORDS[
			Math.floor(Math.random() * ALL_ENGLISH_FIVE_LETTERED_WORDS.length)
		];

	return admin
		.firestore()
		.doc(`words/${randomWord}`)
		.get()
		.then((snapshot) => {
			// Write the word to the database if it doesn't already exist.
			// This will be used for stats tracking purposes later.
			if (!snapshot.exists) {
				return admin.firestore().doc(`words/${randomWord}`).set({ word: randomWord });
			}
			return;
		})
		.then(() => {
			return Promise.resolve(randomWord);
		})
		.catch((error: Error) => {
			functions.logger.error("Error getting random word");
			functions.logger.error(error);
			return Promise.reject(new Error("Error getting random word"));
		});
};

const getWordOfTheDay = async (): Promise<string> => {
	return admin
		.firestore()
		.collection("words")
		.where("date", ">", "")
		.orderBy("date", "desc")
		.limit(1)
		.get()
		.then((snapshot) => {
			if (snapshot.empty) {
				functions.logger.error("Something went wrong fetching the word of the day");
			}
			return snapshot.docs[0].data().word;
		})
		.catch((error) => {
			functions.logger.error("Error getting word of the day");
			functions.logger.error(error);
			return Promise.reject(new Error("Error getting word of the day"));
		});
};

module.exports = {
	generateNewWordForDay,
	getWord
};
