import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

export interface FirebaseRequest extends Request {
	decodedIdToken: DecodedIdToken;
}
