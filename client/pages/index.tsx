import DesktopGameView from "../components/DesktopGameView";
import GameProvider from "../context/gameContext";
import MobileGameView from "../components/MobileGameView";
import React from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

const IndexPage = () => {
	const windowDimensions = useWindowDimensions();

	return (
		<GameProvider>
			{windowDimensions?.width < 768 ? <MobileGameView /> : <DesktopGameView />}
		</GameProvider>
	);
};
export default IndexPage;
