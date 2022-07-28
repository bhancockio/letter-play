import React from "react";
import LettersPlayGame from "../components/LettersPlayGame";

const IndexPage = () => (
	<div className="flex flex-row max-w-5xl mx-auto mt-10">
		<div className="flex flex-1">{/* Game information */}</div>
		<LettersPlayGame />
		<div className="flex flex-1">{/* How to video */}</div>
	</div>
);

export default IndexPage;
