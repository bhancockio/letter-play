import FavoriteIcon from "@mui/icons-material/Favorite";
import React from "react";

function Footer() {
	return (
		<div className="w-100 mt-8 border-solid border-t-2 mx-8 text-center">
			<p className="mt-4">
				Built with{" "}
				<span className="text-red-600">
					<FavoriteIcon />
				</span>{" "}
				by{" "}
				<a
					className="text-purple-500 hover:text-purple-700"
					href="https://twitter.com/bhancock_io"
				>
					@bhancock_io
				</a>
			</p>
		</div>
	);
}

export default Footer;
