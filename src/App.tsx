import { useRef, useState, useEffect } from "react";
import GitHubProfile from "./components/github-profile";
import { UserData } from "@/types";
import { useProfile, useSearchProfiles } from "@/hooks/useGithub";
import { SearchUser } from "./components/search-user";

function App() {
	const profileRef = useRef<HTMLDivElement>(null);
	// Search state
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedUser, setSelectedUser] = useState<string>("");

	// Fetch search results
	const { users, isLoading: isLoadingUsers, error: searchError } = useSearchProfiles({
		query: searchQuery,
		enabled: searchQuery.trim().length > 0
	});

	// Fetch selected user's profile
	const { profile, repositories, isLoading: isLoadingProfile } = useProfile(selectedUser);

	const handleUserSelect = (user: UserData) => {
		setSelectedUser(user.login);
		// setSearchQuery(user.login);
	};

	// Handle scrolling when profile loads
	useEffect(() => {
		if (profile && !isLoadingProfile) {
			setTimeout(() => {
				profileRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 100);
		}
	}, [profile, isLoadingProfile]);

	return (
		<main className="min-h-screen flex flex-col items-center py-8 px-4 bg-background">
			<section className="w-full max-w-md flex flex-col items-center justify-start mt-24">
				<h1 className="text-5xl font-extrabold mb-8 text-center">Github search</h1>
				<SearchUser 
					users={users}
					isLoading={isLoadingUsers || isLoadingProfile}
					error={searchError}
					searchQuery={searchQuery}
					onSearch={setSearchQuery}
					onUserSelect={handleUserSelect}
				/>
			</section>
			
			{profile && (
				<section ref={profileRef} className="w-full mt-16">
					<GitHubProfile profile={profile} repositories={repositories} />
				</section>
			)}
		</main>
	);
}

export default App;