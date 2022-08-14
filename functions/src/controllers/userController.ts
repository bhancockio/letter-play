import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { DecodedIdToken } from "firebase-admin/auth";
import { DocumentSnapshot } from "firebase-admin/firestore";
import { FirebaseRequest } from "../types/FirebaseRequest";
import { IUser } from "@shared";
import { Response } from "express";

const get = async (req: FirebaseRequest, res: Response) => {
	const decodedIdToken: DecodedIdToken = req.decodedIdToken;
	functions.logger.log("Getting user with uid", decodedIdToken.uid);

	// Attempt to get user if exists
	const fbUser = await admin
		.firestore()
		.doc(`users/${decodedIdToken.uid}`)
		.get()
		.then(async (snapshot: DocumentSnapshot) => {
			if (snapshot.exists) {
				return snapshot.data();
			} else {
				return null;
			}
		})
		.catch((err: unknown) => {
			functions.logger.error(err);
			return res.status(400).json({ message: "Error retrieving user" });
		});

	// User exist so return info
	if (fbUser !== null) {
		functions.logger.log("Found user");
		return res.status(200).json(fbUser);
	}

	// User does not exist so create a new one.
	functions.logger.log("User not found. Creating new user", decodedIdToken);
	const user: IUser = {
		email: decodedIdToken.email as string,
		uid: decodedIdToken.uid,
		displayName: decodedIdToken.displayName || decodedIdToken.name,
		created: new Date().toISOString()
	};

	return admin
		.firestore()
		.doc(`users/${user.uid}`)
		.create(user)
		.then(() => {
			functions.logger.log("Get User succeeded");
			return res.status(200).json(user);
		})
		.catch((err: unknown) => {
			functions.logger.error("Get User failed");
			functions.logger.error(err);
			return res.status(400).json({ message: "Error creating user" });
		});
};

module.exports = {
	get
};
