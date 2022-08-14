import { z } from "zod";

const wordSchema = z.object({
	word: z.string().length(5),
	date: z.string().optional(),
	puzzleNumber: z.number().gte(0).optional(),
	gamesPlayed: z.number().gte(0).optional(),
	guessesMade: z.number().gte(0).optional(),
	gamesWon: z.number().gte(0).optional()
});

export type IWord = z.infer<typeof wordSchema>;
