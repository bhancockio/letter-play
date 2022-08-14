import type { Stat } from "@backend/Stat";
import axios from "axios";

export const postStat = (stat: Stat) => {
	return axios.post(`${process.env.NEXT_PUBLIC_FIREBASE_API_URL}/stats`, stat);
};
