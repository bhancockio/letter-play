import "../styles/globals.css";
import { AppProps } from "next/app";
import axios from "axios";
import Head from "next/head";
import React, { ReactElement } from "react";
import Navbar from "../components/Navbar";
import UserProvider from "../context/userContext";

// Axios
axios.defaults.baseURL = process.env.NEXT_PUBLIC_FIREBASE_API_URL;

function App({ Component, pageProps }: AppProps): ReactElement {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const SafeComponet = Component as any;
	return (
		<UserProvider>
			<Head>
				<title>Letters Play</title>
			</Head>
			<Navbar />
			<SafeComponet {...pageProps} />
		</UserProvider>
	);
}

export default App;
