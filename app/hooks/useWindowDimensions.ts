import { useEffect, useState } from "react";

type WindowDimensions = {
	width: number | undefined;
	height: number | undefined;
};

// https://dev.to/adrien/creating-a-custom-react-hook-to-get-the-window-s-dimensions-in-next-js-135k
const useWindowDimensions = (): WindowDimensions => {
	const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
		width: undefined,
		height: undefined
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
