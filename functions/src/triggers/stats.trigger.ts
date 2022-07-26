import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { DocumentData, FieldValue, QueryDocumentSnapshot } from "firebase-admin/firestore";

import { EventContext } from "firebase-functions/v1";
import { User } from "../types/User";
import { Stat } from "../types/Stat";

exports.statsCreated = functions.firestore
	.document("stats/{statsId}")
	.onCreate(async (snap: QueryDocumentSnapshot, context: EventContext) => {
		const stat = snap.data() as Stat;

		if (stat.userId) {
			functions.logger.info("Updating user stats");
			await updateUserStats(stat);
		}

		functions.logger.info("Updating word stats");
		await updateWordStats(stat);
	});

const updateUserStats = (stats: Stat) => {
	return admin
		.firestore()
		.doc(`users/${stats.userId}`)
		.get()
		.then((doc: DocumentData) => {
			return doc.data();
		})
		.then((user: User) => {
			const gamesPlayed = (user.gamesPlayed || 0) + 1;
			const wins = (user.wins || 0) + (stats.guessedCorrectly ? 1 : 0);
			const winStreak = stats.guessedCorrectly ? (user.winStreak || 0) + 1 : 0;
			let averageNumberOfTurns = user.averageNumberOfTurns;
			// Only count using wins. Don't count losses.
			if (stats.guessedCorrectly) {
				averageNumberOfTurns =
					((user.averageNumberOfTurns || 0) * (user.wins || 0) + stats.numberOfGuesses) /
					((user.wins || 0) + 1);
			}
			return {
				...user,
				gamesPlayed: gamesPlayed,
				wins: wins,
				winStreak: winStreak,
				longestWinStreak: Math.max(winStreak, user.longestWinStreak || 0),
				averageNumberOfTurns: averageNumberOfTurns
			};
		})
		.then((updatedUser: User) => {
			return admin.firestore().doc(`users/${stats.userId}`).set(updatedUser);
		})
		.catch((error: any) => {
			functions.logger.error("Something went wrong updating user stats");
			functions.logger.error(error);
			return;
		});
};

const updateWordStats = (stats: Stat) => {
	return admin
		.firestore()
		.doc(`words/${stats.word}`)
		.update({
			gamesPlayed: FieldValue.increment(1),
			guessesMade: FieldValue.increment(stats.numberOfGuesses),
			gamesWon: FieldValue.increment(stats.guessedCorrectly ? 1 : 0)
		})
		.catch((error: any) => {
			functions.logger.error("Something went wrong updating word stats");
			functions.logger.error(error);
			return;
		});
};
