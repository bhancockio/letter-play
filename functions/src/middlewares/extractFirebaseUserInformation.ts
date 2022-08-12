import { NextFunction, Response } from "express";

import { DecodedIdToken } from "firebase-admin/auth";
import { FirebaseRequest } from "../types/FirebaseRequest";

import admin = require("firebase-admin");

module.exports = (request: FirebaseRequest, resposne: Response, next: NextFunction) => {
	let idToken;
	if (request.headers.authorization && request.headers.authorization.startsWith("Bearer ")) {
		// Extract the token from request headers
		// and separate it from 'Bearer ' string
		// and get the actual token.
		idToken = request.headers.authorization.split("Bearer ")[1];
		return admin
			.auth()
			.verifyIdToken(idToken)
			.then((decodedIdToken: DecodedIdToken) => {
				// decodedIdToken holds user
				// data that is inside our
				// idToken. Add this user data
				// to the request object so
				// when this request proceeds
				// forward to any other protected0
				// routes, it has the data for
				// other verification purposes.
				request.decodedIdToken = decodedIdToken;
				// Call next() to proceed towards the route when
				// this middleware execution is finished successfully.
				next();
				return;
			});
	} else {
		next();
		return;
	}
};
