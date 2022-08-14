import type { IStats } from "@shared/types/IStats";
import axios from "axios";

export const postStats = (stats: IStats) => {
	return axios.post(`${process.env.NEXT_PUBLIC_FIREBASE_API_URL}/stats`, stats);
};
