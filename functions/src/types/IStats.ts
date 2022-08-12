import { z } from "zod";

export const statsSchema = z.object({
	userId: z.string().optional(),
	word: z.string().length(5),
	guessedCorrectly: z.boolean(),
	numberOfGuesses: z.number().min(1).max(6)
});

export type IStats = z.TypeOf<typeof statsSchema>;
