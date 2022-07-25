import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { auth, signInWithGoogle } from "../utils/firebase";
import { useUser } from "../context/userContext";

const Navbar = () => {
	const { user } = useUser();

	const handleLogin = async () => {
		await signInWithGoogle();
	};

	const handleLogout = () => {
		auth.signOut();
	};

	return (
		<div className="navbar bg-neutral text-neutral-content">
			<div className="navbar-start">
				<Link href="/" className="btn btn-ghost normal-case text-xl">
					App Logo
				</Link>
			</div>
			<div className="navbar-end flex-none md:hidden">
				<div className="dropdown">
					<label htmlFor="dropdown-menu" tabIndex={0}>
						<MenuIcon />
					</label>
					<ul
						id="dropdown-menu"
						tabIndex={0}
						className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52  text-neutral"
					>
						<li>
							<Link href="link1">Link 1</Link>
						</li>
						<li>
							<Link href="link2">Link 2</Link>
						</li>
						<li>
							{!user ? (
								<button type="button" onClick={handleLogin}>
									Login
								</button>
							) : (
								<button type="button" onClick={handleLogout}>
									Logout
								</button>
							)}
						</li>
					</ul>
				</div>
			</div>
			<div className="navbar-end hidden md:flex ">
				<ul className="menu menu-horizontal p-0">
					<li tabIndex={0}>
						<Link className="btn btn-link no-animation active:bg-red-500" href="link1">
							Link 1
						</Link>
					</li>
					<li>
						<Link className="" href="link2">
							Link 2
						</Link>
					</li>
					<li>
						{!user ? (
							<button
								type="button"
								className="btn btn-outline hover:bg-white hover:text-neutral"
								onClick={handleLogin}
							>
								Login
							</button>
						) : (
							<button
								type="button"
								className="btn btn-outline hover:bg-white hover:text-neutral"
								onClick={handleLogout}
							>
								Logout
							</button>
						)}
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Navbar;
