import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { DecodedIdToken } from "firebase-admin/auth";
import { FirebaseRequest } from "../types/FirebaseRequest";
import { Response } from "express";
import { ZodError } from "zod";
import { generateFirestoreUUID } from "../utils/database";
import { statSchema } from "../schema/stat.schema";

const post = async (req: FirebaseRequest, res: Response) => {
	const decodedIdToken: DecodedIdToken | undefined = req.decodedIdToken;
	functions.logger.log("Posting stats with uid", decodedIdToken?.uid);

	const uid = generateFirestoreUUID();
	try {
		const stats = statSchema.parse(req.body);
		// If an authenticated user submitted data, add their uid
		if (decodedIdToken) {
			stats.userId = decodedIdToken.uid;
		}
		return admin
			.firestore()
			.doc(`stats/${uid}`)
			.set({
				id: uid,
				...stats
			})
			.then(() => {
				return res.status(200).json({ message: "Stats added to database", data: stats });
			});
	} catch (error) {
		if (error instanceof ZodError) {
			functions.logger.error("Error parsing stats");
			functions.logger.error(error);
			// TODO: Figure if this is the best way to return a 400 error
			return res.json({
				message: "Error parsing stats",
				success: false,
				errors: error.flatten()
			});
		} else {
			functions.logger.error("Error adding stats to database");
			functions.logger.error(error);
			return res.status(500).json({ message: "Error adding stats to database" });
		}
	}
};

module.exports = {
	post
};
