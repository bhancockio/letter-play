import { z } from "zod";

const wordSchema = z.object({
	word: z.string().length(5),
	date: z.string().optional(),
	puzzleNumber: z.number().optional()
});

export type IWord = z.TypeOf<typeof wordSchema>;
