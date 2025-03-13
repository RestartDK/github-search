import { useRef, useState, useEffect } from "react";
import { UserData } from "@/types";
import { useProfile, useSearchProfiles } from "@/hooks/useGithub";
import GitHubProfile from "./github-profile";
import { SearchBar } from "./search-bar";
import { Navbar } from "./navbar";
import { Logo } from "./ui/logo";

function Home() {
	const profileRef = useRef<HTMLDivElement>(null);
	// Search state
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedUser, setSelectedUser] = useState<string>("");

	// Fetch search results
	const {
		users,
		isLoading: isLoadingUsers,
		error: searchError,
	} = useSearchProfiles({
		query: searchQuery,
		enabled: searchQuery.trim().length > 0,
	});

	// Fetch selected user's profile
	const {
		profile,
		repositories,
		isLoading: isLoadingProfile,
	} = useProfile(selectedUser);

	const handleUserSelect = (user: UserData) => {
		setSelectedUser(user.login);
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
		<div className="min-h-screen flex flex-col bg-background">
			<Navbar />
			<main className="flex-grow py-8">
				<div className="container mx-auto">
					<section className="flex flex-col items-center justify-start mt-12">
						<h1 className="text-5xl font-extrabold mb-8 text-center flex items-center justify-center gap-3">
							<Logo className="h-12 w-12" />
							Github Search
						</h1>
						<div className="w-full max-w-md mx-auto">
							<SearchBar
								users={users}
								isLoading={isLoadingUsers || isLoadingProfile}
								error={searchError}
								searchQuery={searchQuery}
								onSearch={setSearchQuery}
								onUserSelect={handleUserSelect}
							/>
						</div>
					</section>

					{profile && (
						<section ref={profileRef} className="w-full mt-32">
							<GitHubProfile profile={profile} repositories={repositories} />
						</section>
					)}
				</div>
			</main>
		</div>
	);
}

export default Home;
