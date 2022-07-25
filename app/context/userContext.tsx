import { useState, useEffect, createContext, useContext } from "react";
import { auth, onAuthStateChanged } from "../utils/firebase";
import axios, { AxiosResponse } from "axios";
import { User } from "@backend/User";

export interface IUserContext {
	user: User;
	setUser: (value) => void;
	loadingUser: boolean;
}

export const UserContext = createContext<IUserContext>(null);

export default function UserContextComponent({ children }) {
	const [user, setUser] = useState<User | null>(null);
	const [loadingUser, setLoadingUser] = useState<boolean>(true); // Helpful, to update the UI accordingly.

	useEffect(() => {
		// Listen authenticated user
		const unsubscriber = onAuthStateChanged(auth, async (user: User) => {
			try {
				if (user) {
					axios.defaults.headers.common["Authorization"] = `Bearer ${user.accessToken}`;
					// Look for the user doc in your Firestore (if you have one):
					const fbUser = await axios
						.get(`/users`)
						.then((res: AxiosResponse) => res.data)
						.catch(() => null);
					setUser({ ...fbUser, ...user });
				} else setUser(null);
			} catch (error) {
				setUser(null);
				// Most probably a connection error. Handle appropriately.
			} finally {
				setLoadingUser(false);
			}
		});

		// Unsubscribe auth listener on unmount
		return () => unsubscriber();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser, loadingUser }}>
			{children}
		</UserContext.Provider>
	);
}

// Custom hook that shorthands the context!
export const useUser = () => useContext(UserContext);
