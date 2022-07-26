import { DecodedIdToken } from "firebase-admin/auth";
import { Request } from "express";

export interface FirebaseRequest extends Request {
	decodedIdToken: DecodedIdToken;
}
