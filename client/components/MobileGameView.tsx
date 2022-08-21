import ChallengeAFriends from "./ChallengeAFriends";
import GameInformation from "./GameInformation";
import Keyboard from "./Keyboard";
import LettersGrid from "./LettersGrid";
import Loading from "./Loading";
import Notifications from "./Notifications";
import React from "react";
import { useGame } from "../context/gameContext";
import { useEventListener } from "usehooks-ts";

function MobileGameView() {
	const game = useGame();

	useEventListener('keydown', game.handleKeyDown)
	
	if (!game || game?.state.loading) {
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
				<ChallengeAFriends />
			</div>
		</>
	);
}

export default MobileGameView;
