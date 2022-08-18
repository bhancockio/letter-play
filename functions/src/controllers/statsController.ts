import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { Request, Response } from "express";

import { ZodError } from "zod";
import { generateFirestoreUUID } from "../utils/database";
import { statSchema } from "../schema/stat.schema";

const post = async (req: Request, res: Response) => {
	const uid = generateFirestoreUUID();
	try {
		const stats = { id: uid, ...statSchema.parse(req.body) };
		return admin
			.firestore()
			.doc(`stats/${uid}`)
			.set(stats)
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

const get = (req: Request, res: Response) => {
	const id = req.query.id;

	if (!id) {
		return res.status(400).json({ message: "Missing id" });
	}
	return admin
		.firestore()
		.doc(`stats/${id}`)
		.get()
		.then((snapshot) => {
			if (!snapshot.exists) {
				return res.status(404).json({ message: "Stats not found" });
			}
			return res
				.status(200)
				.json({ message: "Successfully fetched stats", data: snapshot.data() });
		})
		.catch((error) => {
			functions.logger.error("Error fetching stats");
			functions.logger.error(error);
			return res.status(500).json({ message: "Something went wrong fetching the stats" });
		});
};

module.exports = {
	post,
	get
};
