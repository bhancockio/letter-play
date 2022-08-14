import React, { useState } from "react";
import { auth, signInWithGoogle } from "../utils/firebase";

import BarChartIcon from "@mui/icons-material/BarChartOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { IUser } from "@shared/types/IUser";
import Image from "next/image";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import { useUser } from "../context/userContext";

interface IActionsProps {
	user: IUser;
	handleLogin: () => void;
	handleLogout: () => void;
}

const Actions = ({ user, handleLogin, handleLogout }: IActionsProps) => (
	<>
		<li className="mb-3 mt-4 md:mb-0 md:mt-0">
			<button
				type="button"
				className="btn text-white bg-green-500 hover:bg-green-700 hover:text-white"
			>
				<a
					href="?random=true"
					onClick={() => {
						console.log("new game clicked");
					}}
				>
					New Game
				</a>
			</button>
		</li>

		<li className="mb-3 md:mb-0">
			{!user ? (
				<button
					type="button"
					className="btn btn-outline text-white hover:bg-white hover:text-neutral"
					onClick={handleLogin}
				>
					Login
				</button>
			) : (
				<button
					type="button"
					className="btn btn-outline text-white hover:bg-white hover:text-neutral"
					onClick={handleLogout}
				>
					Logout
				</button>
			)}
		</li>
	</>
);

const Navbar = () => {
	const { user } = useUser();
	const [open, setOpen] = useState(false);

	const handleLogin = async () => {
		await signInWithGoogle();
	};

	const handleLogout = () => {
		auth.signOut();
	};

	const Links = [{ name: "Stats", link: "/stats", icon: <BarChartIcon /> }];

	return (
		<div className="navbar bg-neutral text-neutral-content/75 flex flex-col p-3 hover:text-neutral-content">
			<div className="max-w-5xl w-screen flex flex-row px-5">
				<div>
					<Link href="/" className="btn btn-ghost normal-case text-xl">
						<div className="flex flex-row content-center items-center gap-1 cursor-pointer">
							<Image src="/images/Letters.png" height={40} width={180} />
							<span className="text-2xl font-semibold font-cursive text-neutral-content cursor-pointer">
								Play
							</span>
						</div>
					</Link>
				</div>
				<ul className="hidden md:p-0 md:gap-5 md:flex md:flex-row md:flex-1 md:ml-10">
					{Links.map((link, index) => (
						<li key={index} className="my-auto ml-5 cursor-pointer">
							<Link href={link.link}>
								<span className="flex flex-row gap-1 font-semibold">
									{link.icon} {link.name}
								</span>
							</Link>
						</li>
					))}
					<div className="flex flex-1" />
					<Actions user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
				</ul>
				<div
					onClick={() => setOpen(!open)}
					className="text-3xl cursor-pointer md:hidden mt-[-6px] ml-auto"
				>
					{open ? <CloseIcon /> : <MenuIcon />}
				</div>
			</div>
			{open && (
				<div className="md:hidden max-w-5xl w-screen px-5 mt-4 text-left">
					<ul className="w-screen">
						{Links.map((link, index) => (
							<li
								key={index}
								className="border-t-[1px] border-white-50 py-2 text-xl cursor-pointer"
							>
								<Link href={link.link}>
									<span className="ml-4 font-semibold">
										{link.icon} {link.name}
									</span>
								</Link>
							</li>
						))}
						<Actions
							user={user}
							handleLogin={handleLogin}
							handleLogout={handleLogout}
						/>
					</ul>
				</div>
			)}
		</div>
	);
};

export default Navbar;
