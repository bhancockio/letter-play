import { HashLoader } from "react-spinners";
import React from "react";

function Loading() {
	return (
		<div className="w-full h-[70vh] flex flex-col justify-center align-middle text-center">
			<HashLoader className="mx-auto" color="#22c55e" size="100px" />
			<span className="text-2xl md:text-3xl">Loading...</span>
		</div>
	);
}

export default Loading;
