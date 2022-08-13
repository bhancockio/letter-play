const functions = require("firebase-functions");
const admin = require("firebase-admin");

import { EventContext } from "firebase-functions/v1";
import { IStats } from "../types/IStats";
import { IUser } from "../types/IUser";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

exports.statsCreated = functions.firestore
	.document("stats/{statsId}")
	.onCreate(async (snap: QueryDocumentSnapshot, context: EventContext) => {
		const stats = snap.data() as IStats;

		if (stats.userId) {
			await updateUserStats(stats);
		}

		await updateWordStats(stats);
	});

// TODO: Update personal users stats
const updateUserStats = (stats: IStats) => {
	return admin
		.firestore()
		.doc(`users/${stats.userId}`)
		.get()
		.then((doc: QueryDocumentSnapshot) => {
			return doc.data();
		})
		.then((user: IUser) => {
			const gamesPlayed = (user.gamesPlayed || 0) + 1;
			const wins = (user.gamesPlayed || 0) + (stats.guessedCorrectly ? 1 : 0);
			const winStreak = stats.guessedCorrectly ? (user.winStreak || 0) + 1 : 0;
			const averageNumberOfTurns =
				((user.averageNumberOfTurns || 0) * (user.gamesPlayed || 0) +
					stats.numberOfGuesses) /
				(user.gamesPlayed || 0 + 1);
			return {
				...user,
				gamesPlayed: gamesPlayed,
				wins: wins,
				winStreak: winStreak,
				averageNumberOfTurns: averageNumberOfTurns
			};
		})
		.then((updatedUser: IUser) => {
			return admin.firestore().doc(`users/${stats.userId}`).set(updatedUser);
		})
		.catch((error: any) => {
			functions.logger.error("Something went wrong updating user stats");
			functions.logger.error(error);
			return;
		});
};

const updateWordStats = (stats: IStats) => {
	return admin
		.firstore()
		.doc(`words/${stats.word}`)
		.update({
			gamesPlayed: admin.firestore.FieldValue.increment(1),
			guessesMade: admin.firestore.FieldValue.increment(stats.numberOfGuesses),
			gamesWon: admin.firestore.FieldValue.increment(stats.guessedCorrectly ? 1 : 0)
		})
		.catch((error: any) => {
			functions.logger.error("Something went wrong updating word stats");
			functions.logger.error(error);
			return;
		});
};
