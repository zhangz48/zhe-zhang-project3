import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

		// Fetch the authenticated user data
		const { data: authUser } = useQuery({
			queryKey: ["authUser"],
			queryFn: async () => {
				try {
					const res = await fetch("/api/auth/me");
					const data = await res.json();
					if (!res.ok) {
						throw new Error(data.error || "Something went wrong");
					}
					return data;
				} catch (error) {
					return null; // Return null if user is not logged in
				}
			},
			retry: false,
		});

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>


				{/* CREATE POST INPUT - Only for logged-in users */}
				{authUser && <CreatePost />}

				{/* POSTS - Pass feedType */}
				<Posts feedType="forYou" />
			</div>
		</>
	);
};
export default HomePage;