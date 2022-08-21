import DesktopGameView from "../components/DesktopGameView";
import GameProvider from "../context/gameContext";
import MobileGameView from "../components/MobileGameView";
import React from "react";
import { useWindowSize } from "usehooks-ts";

const IndexPage = () => {
	const windowDimensions = useWindowSize();

	return (
		<GameProvider>
			{windowDimensions?.width < 768 ? <MobileGameView /> : <DesktopGameView />}
		</GameProvider>
	);
};
export default IndexPage;
