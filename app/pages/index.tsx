import React from "react";
import LettersPlayGame from "../components/LettersPlayGame";

const IndexPage = () => (
	<div className="flex flex-row max-w-5xl mx-auto">
		<div className="flex flex-1"></div> {/* Game information*/}
		<LettersPlayGame />
		<div className="flex flex-1"></div> {/* How to video*/}
	</div>
);

export default IndexPage;
