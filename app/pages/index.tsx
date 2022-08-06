import React from "react";
import GameInformation from "../components/GameInformation";
import Keyboard from "../components/Keyboard";
import LettersGrid from "../components/LettersGrid";
import Notifications from "../components/Notifications";
import GameProvider from "../context/gameContext";

const IndexPage = () => (
	<GameProvider>
		<div className="flex flex-row max-w-5xl mx-auto mb-5 ">
			<div className="flex flex-2 flex-col-reverse lg:gap-5 lg:flex-row lg:flex-1">
				<div className="flex flex-row">
					<div className="hidden md:flex md:flex-1" />
					<GameInformation />
				</div>
				<div className="flex flex-col">
					<Notifications />
					<div className="flex flex-row mx-2 md:mx-0">
						<div className="hidden md:flex md:flex-1" />
						<LettersGrid />
					</div>
				</div>
			</div>
			<div className="hidden md:flex md:flex-1">{/* How to video */}</div>
		</div>
		<Keyboard />
	</GameProvider>
);

export default IndexPage;
