export type User = {
	uid: string;
	displayName: string;
	email: string;
	accessToken?: string;
	created?: string;

	// STATS
	gamesPlayed?: number;
	wins?: number;
	winStreak?: number;
	longestWinStreak?: number;
	averageNumberOfTurns?: number;
};
