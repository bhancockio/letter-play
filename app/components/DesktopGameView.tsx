import GameInformation from "./GameInformation";
import Keyboard from "./Keyboard";
import LettersGrid from "./LettersGrid";
import Loading from "./Loading";
import Notifications from "./Notifications";
import React from "react";
import { useGame } from "../context/gameContext";

function DesktopGameView() {
	const { gameState } = useGame();

	if (gameState.loading) {
		return <Loading />;
	}
	return (
		<>
			<div>
				<Notifications />
			</div>
			<div className="flex flex-row mb-5 ">
				<div className="flex flex-1 flex-row gap-5">
					<div className="flex flex-row">
						<div className="flex flex-1" />
						<div className="mt-2 mx-auto">
							<GameInformation />
						</div>
					</div>
					<div className="flex flex-row mx-0">
						<div className="flex flex-1" />
						<div className="mt-2">
							<LettersGrid />
						</div>
					</div>
				</div>
				<div className="flex flex-1">{/* How to video */}</div>
			</div>
			<Keyboard />
		</>
	);
}

export default DesktopGameView;
