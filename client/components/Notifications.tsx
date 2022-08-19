import React from "react";
import { useGame } from "../context/gameContext";

function Notifications() {
	const game = useGame();
	const { message, submissionStatus } = game.state;

	const getStylesForMessageType = () => {
		if (submissionStatus === "error") {
			return "bg-red-200 text-red-500";
		}
		return "bg-white text-black";
	};

	return (
		<div
			className={`py-1 text-center font-semibold text-lg rounded min-h-[36px] ${getStylesForMessageType()}`}
		>
			{message?.show ? message.text : ""}
		</div>
	);
}

export default Notifications;
