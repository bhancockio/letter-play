import { z } from "zod";

export const userSchema = z.object({
	uid: z.string(),
	displayName: z.string(),
	email: z.string().email(),
	accessToken: z.string().optional(),
	created: z.string().optional() // ISO Timestamp
});

export type IUser = z.TypeOf<typeof userSchema>;
