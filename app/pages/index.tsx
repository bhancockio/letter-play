import GameInformation from "../components/GameInformation";
import GameProvider from "../context/gameContext";
import Keyboard from "../components/Keyboard";
import LettersGrid from "../components/LettersGrid";
import Notifications from "../components/Notifications";
import React from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

const IndexPage = () => {
	const { width } = useWindowDimensions();

	// // Mobile view
	if (width < 768) {
		return (
			<GameProvider>
				<div className="max-w-5xl mx-auto">
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
			</GameProvider>
		);
	}

	// Desktop view
	return (
		<GameProvider>
			<div className="max-w-5xl mx-auto">
				<Notifications />
			</div>
			<div className="flex flex-row max-w-5xl mx-auto mb-5 ">
				<div className="flex flex-1 flex-row gap-5">
					<div className="flex flex-row">
						<div className="flex flex-1" />
						<div className="mt-12 mx-auto">
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
		</GameProvider>
	);
};
export default IndexPage;
