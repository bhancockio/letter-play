import moment from "moment";
import axios from "axios";

export const fetchWord = (word: string) => {
	const now = moment.utc().format("YYYY-MM-DD");
	return fetchWordForDate(now);
};

// Date is formatted as YYYY-MM-DD
export const fetchWordForDate = (date: string) => {
	// TODO: Make this actually grab words from the API
	return Promise.resolve("games");
};
