import React from "react";
import { useGame } from "../context/gameContext";

function GameInformation() {
	const { gameState } = useGame();
	const { targetWord, targetWordGuessed, outOfGuesses } = gameState;

	const endOfGamePrompt = () => {
		const bgColor = targetWordGuessed ? "bg-green-200" : "bg-red-200";
		const textColor = targetWordGuessed ? "text-green-700" : "text-red-700";

		return (
			<div className={`${bgColor} ${textColor} font-semibold py-2 px-4 rounded-md my-5`}>
				{targetWordGuessed ? (
					<p>
						You guessed {targetWord.toUpperCase()}. Great job! You should{" "}
						<a href="/" className="underline">
							create a free account
						</a>{" "}
						to save your stats/streaks.
					</p>
				) : (
					<p>
						The correct word was {targetWord.toUpperCase()}. Don&apos;t worry. Click New
						Game below to start another game.
					</p>
				)}
			</div>
		);
	};

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
			{(targetWordGuessed || outOfGuesses) && (
				<>
					{endOfGamePrompt()}
					<div className="flex flex-row justify-abround">
						<button
							type="button"
							className="bg-green-500 py-2 px-3 tracking-tight mr-1 rounded-md text-white font-semibold"
						>
							<a href="?random=true">New Game</a>
						</button>
						<button
							type="button"
							className="bg-purple-500 py-2 px-3 tracking-tight mr-1 rounded-md text-white font-semibold"
						>
							share
						</button>
						<button
							type="button"
							className="bg-purple-500 py-2 px-3 tracking-tight rounded-md text-white font-semibold"
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
