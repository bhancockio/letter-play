import React, { useEffect } from "react";

import { Stat } from "@backend/Stat";
import { getStats } from "utils/statUtil";
import moment from "moment";
import { useGame } from "../context/gameContext";
import { useRouter } from "next/router";

function GameInformation() {
	const game = useGame();
	const { targetWord, targetWordGuessed, gameOver, puzzleNumber, date } = game.state;
	const [stats, setStats] = React.useState<Stat | null>();
	const router = useRouter();

	useEffect(() => {
		const safePath = router.asPath.replace(/\//g, "").replace("?", "");
		const [query, id] = safePath.split("=");
		if (query === "statId") {
			getStats(id)
				.then((resp) => {
					if (resp.data.data?.userName) {
						setStats(resp.data.data);
					} else {
						setStats(null);
					}
				})
				.catch(() => {
					setStats(null);
				});
		} else {
			setStats(null);
		}
	}, [router.asPath]);

	const endOfGamePrompt = () => {
		const bgColor = targetWordGuessed ? "bg-green-200" : "bg-red-200";
		const textColor = targetWordGuessed ? "text-green-700" : "text-red-700";

		return (
			<div className={`${bgColor} ${textColor} font-semibold py-2 px-4 rounded-md my-5`}>
				{targetWordGuessed ? (
					<p>
						You guessed {targetWord?.toUpperCase()}. Great job! You should{" "}
						<a href="/" className="underline">
							create a free account
						</a>{" "}
						to save your stats/streaks.
					</p>
				) : (
					<p>
						The correct word was {targetWord?.toUpperCase()}. Don&apos;t worry. Click
						New Game below to start another game.
					</p>
				)}
			</div>
		);
	};

	return (
		<div className="w-[341px] mx-auto">
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
				{puzzleNumber >= 0 && (
					<div className="mb-2">
						<h2 className="text-lg font-semibold text-slate-800">
							Daily Puzze #{puzzleNumber}
						</h2>
						<p className="text-slate-700 mb-1">{moment(date).format("MMMM Do YYYY")}</p>
						<p className="text-slate-700 mb-1">
							A new word is selected every day at midnight UTC
						</p>
					</div>
				)}
			</div>
			{stats && (
				<div className="flex flex-col p-4 mt-4 rounded-md border-2 border-gray-300">
					<div className="mb-2">
						<h2 className="text-lg font-semibold text-slate-800">
							Challenger: <span>{stats.userName}</span>
						</h2>
						<p className="text-slate-700">
							{stats.userName} was able to guess this word in{" "}
							<span className="font-bold">{stats.numberOfGuesses} </span>
							tries. Good luck!
						</p>
					</div>
				</div>
			)}

			{/* Winner  (prompt to create a new acount) */}
			{gameOver && (
				<>
					{endOfGamePrompt()}
					<div className="flex flex-row justify-between">
						<button
							type="button"
							className="bg-green-500 py-2 px-4 tracking-tight mr-1 rounded-md text-white font-semibold"
						>
							<a href="?random=true">New Game</a>
						</button>
						<label
							htmlFor="challenge-modal"
							className="bg-purple-500 py-2 px-4 tracking-tight rounded-md text-white font-semibold"
						>
							Challenge A Friend
						</label>
					</div>
				</>
			)}
		</div>
	);
}

export default GameInformation;
