import "../styles/globals.css";

import React, { ReactElement } from "react";

import { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "../components/Navbar";
import UserProvider from "../context/userContext";
import axios from "axios";

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
			<div className="max-w-5xl mx-auto">
				<SafeComponet {...pageProps} />
			</div>
		</UserProvider>
	);
}

export default App;
