import React from "react";
import { useGame } from "../context/gameContext";

function GameInformation() {
	const { gameState } = useGame();
	const { targetWord, targetWordGuessed } = gameState;

	return (
		<div
			className={`w-[341px] mx-auto ${
				targetWordGuessed ? "mt-4" : "mt-[280px]"
			} lg:mt-12 lg:mr-auto`}
		>
			{/* Card about the game */}
			<div className="flex flex-col p-4 rounded-md border-2 border-gray-300">
				<div className="mb-2">
					<h2 className="text-lg font-semibold text-slate-800">
						Welcome to LettersPlay!
					</h2>
					<p className="text-slate-700">
						It&apos;s for people that love Wordle, but hate limits. Enjoy unlimited
						games, challenge others and learn about words.
					</p>
				</div>
				<div className="mb-2">
					<h2 className="text-lg font-semibold text-slate-800">Daily Puzze #213</h2>
					<p className="text-slate-700 mb-1">Mon, Aug 01</p>
					<p className="text-slate-700 mb-1">
						A new word is selected every day at midnight Easter Time
					</p>
					<p className="text-slate-700 mb-1">Game ID: 362850426 </p>
				</div>
			</div>

			{/* Winner  (prompt to create a new acount) */}
			{targetWordGuessed && (
				<>
					<div className="bg-green-200 py-2 px-4 rounded-md my-5">
						<p className="text-green-700 font-semibold">
							You guessed {targetWord.toUpperCase()}. Great job! You should{" "}
							<a href="/" className="underline">
								create a free account
							</a>{" "}
							to save your stats/streaks.
						</p>
					</div>
					<div>
						<button
							type="button"
							className="bg-green-500 p-2 tracking-tight mr-1 rounded-md text-white font-semibold"
						>
							New Game
						</button>
						<button
							type="button"
							className="bg-purple-500 p-2 tracking-tight mr-1 rounded-md text-white font-semibold"
						>
							Save
						</button>
						<button
							type="button"
							className="bg-purple-500 p-2 tracking-tight rounded-md text-white font-semibold"
						>
							Challenge A Friend
						</button>
					</div>
				</>
			)}
		</div>
	);
}

export default GameInformation;
