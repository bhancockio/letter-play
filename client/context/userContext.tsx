import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../utils/firebase";
import axios, { AxiosResponse } from "axios";

import { User } from "@backend/User";

export interface IUserContext {
	user: User | null;
	setUser: (value: User) => void;
	loadingUser: boolean;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);
type Props = {
	children?: ReactNode;
};

export default function UserContextComponent(props: Props) {
	const [user, setUser] = useState<User | null>(null);
	const [loadingUser, setLoadingUser] = useState<boolean>(true); // Helpful, to update the UI accordingly.

	useEffect(() => {
		// Listen authenticated user
		const unsubscriber = onAuthStateChanged(auth, async (user) => {
			try {
				if (user) {
					const token = (await user.getIdTokenResult())?.token;
					axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
					// Look for the user doc in your Firestore (if you have one):
					const fbUser = await axios
						.get(`/users`)
						.then((res: AxiosResponse) => res.data)
						.catch(() => {});
					setUser({ ...(fbUser as User) });
				} else {
					setUser(null);
				}
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
			{props.children}
		</UserContext.Provider>
	);
}

// Custom hook that shorthands the context!
export const useUser = () => useContext(UserContext);
