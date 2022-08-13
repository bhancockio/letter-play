import GameInformation from "./GameInformation";
import Keyboard from "./Keyboard";
import LettersGrid from "./LettersGrid";
import Loading from "./Loading";
import Notifications from "./Notifications";
import React from "react";
import { useGame } from "../context/gameContext";

function MobileGameView() {
	const { gameState } = useGame();

	if (gameState.loading) {
		return <Loading />;
	}

	return (
		<>
			<div>
				<Notifications />
			</div>
			<div className="flex flex-col">
				<div className="mt-2">
					<LettersGrid />
				</div>
				<div className="mt-4 mx-2">
					<Keyboard />
				</div>
				<div className="my-4">
					<GameInformation />
				</div>
			</div>
		</>
	);
}

export default MobileGameView;
