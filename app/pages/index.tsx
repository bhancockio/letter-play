import React from "react";
import Keyboard from "../components/Keyboard";
import LettersGrid from "../components/LettersGrid";
import GameProvider from "../context/gameContext";

const IndexPage = () => (
	<GameProvider>
		<div className="flex flex-row max-w-5xl mx-auto mt-10 mb-5">
			<div className="flex flex-1">{/* Game information */}</div>
			<LettersGrid />
			<div className="flex flex-1">{/* How to video */}</div>
		</div>
		<Keyboard />
	</GameProvider>
);

export default IndexPage;
