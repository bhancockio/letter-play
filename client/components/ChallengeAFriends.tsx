import React from "react";
import { useGame } from "context/gameContext";

function ChallengeAFriends() {
	const { state } = useGame();

	const copyToClipboard = () => {
		const el = document.createElement("textarea");
		document.body.appendChild(el);
		el.value = `${process.env.NEXT_PUBLIC_BASE_URL}?statId=${state.stat?.id}`;
		el.select();
		document.execCommand("copy");
		document.body.removeChild(el);
	};

	return (
		<>
			<input type="checkbox" id="challenge-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box text-center">
					<h3 className="font-bold text-2xl">Challenge A Friend!</h3>
					<div className="mt-3 text-md font-semibold text-black/70">
						<p className="py-3">
							I solved a LettersPlay in {state.stat?.numberOfGuesses} out of 6 turns.
						</p>
						<p className="py-3">See how you do on the same word I played</p>
						<p className="py-3 bg-green-100 rounded-lg">
							{process.env.NEXT_PUBLIC_BASE_URL}/?statId={state.stat?.id}
						</p>
					</div>
					<div className="modal-action justify-around">
						<label htmlFor="challenge-modal" className="btn">
							Close
						</label>
						<button
							type="button"
							className="btn bg-purple-500 border-none"
							onClick={copyToClipboard}
						>
							Copy to Clipboard
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default ChallengeAFriends;
