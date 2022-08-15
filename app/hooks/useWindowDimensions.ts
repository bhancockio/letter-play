import { useEffect, useState } from "react";

type WindowDimensions = {
	width: number | 0;
	height: number | 0;
};

// https://dev.to/adrien/creating-a-custom-react-hook-to-get-the-window-s-dimensions-in-next-js-135k
const useWindowDimensions = (): WindowDimensions => {
	const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
		width: 0,
		height: 0
	});

	useEffect(() => {
		const handleResize = (): void => {
			setWindowDimensions({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return (): void => window.removeEventListener("resize", handleResize);
	}, []);

	return windowDimensions;
};

export default useWindowDimensions;
