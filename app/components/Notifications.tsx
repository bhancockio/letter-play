import React from "react";
import { useGame } from "../context/gameContext";

function Notifications() {
	const { gameState } = useGame();
	const { message, submissionStatus } = gameState;

	const getStylesForMessageType = () => {
		if (submissionStatus === "error") {
			console.log("here");
			return "bg-red-200 text-red-500";
		} else {
			return "bg-white text-black";
		}
	};

	return (
		<div className="h-12">
			<div
				className={`py-1 text-center font-semibold text-lg rounded ${getStylesForMessageType()}`}
			>
				{message?.show ? message.text : ""}
			</div>
		</div>
	);
}

export default Notifications;
