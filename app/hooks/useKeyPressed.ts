import { useEffect, useState } from "react";

// Need to return the key pressed event when a
// key is clicked in the windiow
// TODO: Talk to avery to see how this could be used instead of the keyboard componenent option
const useKeyPressed = () => {
	const [onKeyPressed, setOnKeyPressed] = useState<KeyboardEvent | undefined>(undefined);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			setOnKeyPressed(e);
		};
		window.addEventListener("keydown", handleKeyDown);
		return (): void => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return onKeyPressed;
};

export default useKeyPressed;
