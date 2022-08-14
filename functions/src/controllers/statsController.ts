import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { Response } from "express";
import { ZodError } from "zod";
import { generateFirestoreUUID } from "../utils/database";
import { statSchema } from "../schema/stat.schema";

const post = async (req: Request, res: Response) => {
	const uid = generateFirestoreUUID();
	try {
		const stats = statSchema.parse(req.body);
		// If an authenticated user submitted data, add their uid

		return admin
			.firestore()
			.doc(`stats/${uid}`)
			.set({
				id: uid,
				...stats
			})
			.then(() => {
				return res
					.status(200)
					.json({ message: "Stats added to database", success: true, data: stats });
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
