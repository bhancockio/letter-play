import GameProvider, { useGame } from "../context/gameContext";
import React, { useState } from "react";

import DesktopGameView from "../components/DesktopGameView";
import MobileGameView from "../components/MobileGameView";
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
