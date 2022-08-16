import React, { useEffect } from "react";

import { DEFAULT_GAME_STATS } from "../../utils/constants";
import { User } from "@backend/User";
import { useUser } from "../../context/userContext";

function Stats() {
	const [gameStats, setGameStats] = React.useState(DEFAULT_GAME_STATS);
	const { user } = useUser();

	useEffect(() => {
		if (user) {
			const udpateGameStats = { ...DEFAULT_GAME_STATS };
			const gameStatKeys = Object.keys(DEFAULT_GAME_STATS);
			type GameStatKeys = keyof typeof DEFAULT_GAME_STATS;
			type UserKeys = keyof User;
			Object.keys(user).forEach((key) => {
				if (gameStatKeys.includes(key)) {
					// udpateGameStats[key].stat = user[key] as number;
					(udpateGameStats[key as GameStatKeys] as any).stat = user[key as UserKeys];
				}
			});
			setGameStats(udpateGameStats);
		}
	}, [user]);

	return (
		<div className="flex flex-col mt-8 mx-6">
			<h1 className="text-4xl font-bold opacity-90 mb-6">Game Stats</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{Object.values(gameStats).map((value, index) => (
					<div
						key={index}
						className="flex flex-row border-solid border-2 border-gray-100 p-5 rounded-lg"
					>
						<div className="text-white bg-purple-500 rounded-md p-3 mr-5 my-auto">
							<value.logo className="mt-[-5px]" />
						</div>
						<div className="flex flex-col text-black/60 ">
							<span className="font-semibold text-lg">{value.text}</span>
							<span className="font-bold text-2xl">
								{Math.round(value.stat * 10) / 10}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Stats;
