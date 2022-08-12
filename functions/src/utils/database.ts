export const generateFirestoreUUID = () => {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let autoId = "";
	for (let i = 0; i < 28; i++) {
		autoId += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return autoId;
};

export const generateUserFriendlyUUID = () => {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let autoId = "";
	for (let i = 0; i < 6; i++) {
		autoId += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return autoId;
};
