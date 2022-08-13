import DesktopGameView from "../components/DesktopGameView";
import GameProvider from "../context/gameContext";
import MobileGameView from "../components/MobileGameView";
import React from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

const IndexPage = () => {
	const { width } = useWindowDimensions();

	// // Mobile view
	if (width < 768) {
		return (
			<GameProvider>
				<MobileGameView />
			</GameProvider>
		);
	}

	// Desktop view
	return (
		<GameProvider>
			<DesktopGameView />
		</GameProvider>
	);
};
export default IndexPage;
