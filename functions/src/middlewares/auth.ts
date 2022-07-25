import { Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { FirebaseRequest } from "../types/FirebaseRequest";
import admin = require("firebase-admin");

module.exports = (request: FirebaseRequest, response: Response, next: NextFunction) => {
	let idToken;
	if (request.headers.authorization && request.headers.authorization.startsWith("Bearer ")) {
		// Extract the token from request headers
		// and separate it from 'Bearer ' string
		// and get the actual token.
		idToken = request.headers.authorization.split("Bearer ")[1];
	} else {
		return response.status(403).json({ error: "Unauthorized access" });
	}
	// Now verify that the token
	// was issued by our application
	// and not by any other uninvited
	// application or source.
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
		})
		.catch((err: unknown) => {
			console.log("Error in auth middleware.");
			return response.status(403).json({ error: err });
		});
};
