import React from "react";
import Keyboard from "../components/Keyboard";
import LettersGrid from "../components/LettersGrid";
import Notifications from "../components/Notifications";
import GameProvider from "../context/gameContext";

const IndexPage = () => (
	<GameProvider>
		<div className="flex flex-row max-w-5xl mx-auto mb-5">
			<div className="flex flex-1">{/* Game information */}</div>
			<div className="flex flex-1 flex-col">
				<Notifications />
				<LettersGrid />
			</div>
			<div className="flex flex-1">{/* How to video */}</div>
		</div>
		<Keyboard />
	</GameProvider>
);

export default IndexPage;
