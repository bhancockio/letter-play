import React from "react";

function LetterTile({ letter }) {
	return (
		<div className="w-full py-2 rounded-md text-center border-4 border-black text-3xl font-bold">
			{letter}
		</div>
	);
}

export default LetterTile;
