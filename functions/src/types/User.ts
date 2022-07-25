export interface User {
	uid: string;
	displayName: string;
	email: string;
	accessToken?: string;
	created?: string; // ISO Timestamp
}
