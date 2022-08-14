import { z } from "zod";

export const userSchema = z.object({
	uid: z.string(),
	displayName: z.string(),
	email: z.string().email(),
	accessToken: z.string().optional(),
	created: z.string().optional(), // ISO Timestamp

	// STATS
	gamesPlayed: z.number().gte(0).optional(),
	wins: z.number().gte(0).optional(),
	winStreak: z.number().gte(0).optional(),
	longestWinStreak: z.number().gte(0).optional(),
	averageNumberOfTurns: z.number().gte(0).optional()
});
