import {
	Search,
	Users,
	GitPullRequest,
	Book,
	GitCommit,
	CircleDot,
	Star,
	Mail,
	Link,
	MapPin,
	Building2,
	LucideIcon,
	GitFork,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Repository, Profile, RepositoryType, SortOption } from "@/types";
import { useState, useMemo } from "react";
import { languageColors } from "@/lib/constants";

interface StatCardProps {
	icon: LucideIcon;
	value: number;
	label: string;
}

function StatCard({ icon: Icon, value, label }: StatCardProps) {
	return (
		<div className="border rounded-md p-3 flex flex-col items-center">
			<Icon className="w-5 h-5 mb-1" />
			<span className="text-xl font-bold">{value}</span>
			<span className="text-xs text-muted-foreground">{label}</span>
		</div>
	);
}

interface GitHubProfileProps {
	profile?: Profile;
	repositories?: Repository[];
}

export default function GitHubProfile({
	profile,
	repositories = [],
}: GitHubProfileProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<RepositoryType>("all");
	const [languageFilter, setLanguageFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<SortOption>("updated");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5; // Number of repositories per page

	// Get unique languages from repositories
	const languages = useMemo(() => {
		const langs = new Set(
			repositories.map((repo) => repo.language).filter(Boolean)
		);
		return ["all", ...Array.from(langs)] as string[];
	}, [repositories]);

	// Filter and sort repositories
	const filteredRepositories = useMemo(() => {
		return repositories
			.filter((repo) => {
				const matchesSearch = searchQuery
					? repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					  repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
					: true;

				const matchesType =
					typeFilter === "all"
						? true
						: typeFilter === "fork"
						? repo.fork
						: !repo.fork;

				const matchesLanguage =
					languageFilter === "all" ? true : repo.language === languageFilter;

				return matchesSearch && matchesType && matchesLanguage;
			})
			.sort((a, b) => {
				switch (sortBy) {
					case "stars":
						return b.stargazersCount - a.stargazersCount;
					case "name":
						return a.name.localeCompare(b.name);
					case "updated":
					default:
						return (
							new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
						);
				}
			});
	}, [repositories, searchQuery, typeFilter, languageFilter, sortBy]);

	// Calculate pagination values
	const totalPages = Math.ceil(filteredRepositories.length / itemsPerPage);
	const paginatedRepositories = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredRepositories.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredRepositories, currentPage, itemsPerPage]);

	// Reset to first page when filters change
	useMemo(() => {
		setCurrentPage(1);
	}, [searchQuery, typeFilter, languageFilter, sortBy]);

	if (!profile) {
		return null;
	}

	const statCards = [
		{
			icon: GitPullRequest,
			value: profile.totalPRs,
			label: "PRs",
		},
		{
			icon: Book,
			value: profile.publicRepos,
			label: "Repositories",
		},
		{
			icon: GitCommit,
			value: profile.totalCommits,
			label: "Commits",
		},
		{
			icon: CircleDot,
			value: profile.totalIssues,
			label: "Issues",
		},
		{
			icon: Star,
			value: profile.totalStars,
			label: "Stars",
		},
	];

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col md:flex-row gap-8">
					{/* Left sidebar - Profile */}
					<div className="w-full md:w-1/3 space-y-6">
						{/* Profile image */}
						<div className="flex flex-col md:flex-col items-start">
							<div className="flex items-center md:block gap-4">
								<img
									src={profile.avatarUrl}
									alt={profile.name || profile.login}
									className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-border"
								/>
								<div className="md:mt-4">
									<h1 className="text-2xl md:text-3xl font-bold text-foreground">
										{profile.name || profile.login}
									</h1>
									<h2 className="text-base md:text-lg text-muted-foreground">
										{profile.login}
									</h2>
									<div className="flex items-center gap-1 mt-2 md:mt-4">
										<Users className="w-4 h-4" />
										<span className="text-sm">
											<strong>{profile.following}</strong> Following •{" "}
											<strong>{profile.followers}</strong> followers
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* About section */}
						{profile.bio && (
							<div className="space-y-2">
								<h3 className="text-base font-bold">About</h3>
								<p className="text-sm text-muted-foreground">{profile.bio}</p>
							</div>
						)}

						{/* Social section */}
						<div className="space-y-2">
							<h3 className="text-base font-bold">Social</h3>
							<div className="space-y-2">
								{profile.company && (
									<div className="flex items-center gap-2">
										<Building2 className="w-4 h-4" />
										<span className="text-sm">{profile.company}</span>
									</div>
								)}
								{profile.location && (
									<div className="flex items-center gap-2">
										<MapPin className="w-4 h-4" />
										<span className="text-sm">{profile.location}</span>
									</div>
								)}
								{profile.email && (
									<div className="flex items-center gap-2">
										<Mail className="w-4 h-4" />
										<span className="text-sm">{profile.email}</span>
									</div>
								)}
								{profile.blog && (
									<div className="flex items-center gap-2">
										<Link className="w-4 h-4" />
										<a
											href={profile.blog}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-primary hover:underline"
										>
											{profile.blog}
										</a>
									</div>
								)}
							</div>
						</div>

						{/* Statistics section */}
						<div className="space-y-4">
							<h3 className="text-base font-bold">Statistics</h3>
							<div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
								{statCards.map((card, index) => (
									<StatCard
										key={index}
										icon={card.icon}
										value={card.value}
										label={card.label}
									/>
								))}
							</div>
						</div>
					</div>

					{/* Right content - Repositories */}
					<div className="w-full md:w-2/3 flex flex-col">
						{/* Search and filters */}
						<div className="flex flex-col md:flex-row gap-3 mb-6">
							<div className="relative flex-grow">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									placeholder="Search repositories..."
									className="pl-10 border-border rounded-md"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className="flex gap-2">
								<Select
									value={typeFilter}
									onValueChange={(value: RepositoryType) =>
										setTypeFilter(value)
									}
								>
									<SelectTrigger className="cursor-pointer">
										<SelectValue placeholder="Type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All</SelectItem>
										<SelectItem value="source">Source</SelectItem>
										<SelectItem value="fork">Forks</SelectItem>
									</SelectContent>
								</Select>

								<Select
									value={languageFilter}
									onValueChange={(value: string) => setLanguageFilter(value)}
								>
									<SelectTrigger className="cursor-pointer">
										<SelectValue placeholder="Language" />
									</SelectTrigger>
									<SelectContent>
										{languages.map((lang) => (
											<SelectItem key={lang} value={lang}>
												{lang === "all" ? "All Languages" : lang}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select
									value={sortBy}
									onValueChange={(value: SortOption) => setSortBy(value)}
								>
									<SelectTrigger className="cursor-pointer">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="updated">Last Updated</SelectItem>
										<SelectItem value="stars">Most Stars</SelectItem>
										<SelectItem value="name">Name</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Repository list container - flex with distinct sections */}
						<div className="flex flex-col h-[700px]">
							{/* Repository content with fixed size cards and scrolling */}
							<div className="flex-grow overflow-y-auto pr-2">
								{paginatedRepositories.length > 0 ? (
									<ul className="grid grid-cols-1 gap-4">
										{paginatedRepositories.map((repo) => (
											<li
												key={repo.id}
												className="border border-border rounded-md p-4 h-32 flex flex-col"
											>
												<div className="flex justify-between items-start">
													<div className="w-full overflow-hidden">
														<a
															href={repo.htmlUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="text-xl font-semibold hover:text-primary hover:underline truncate block"
														>
															{repo.name}
														</a>
														<p className="text-sm text-muted-foreground mt-1 line-clamp-2 h-10">
															{repo.description || "No description available"}
														</p>
														<div className="flex items-center gap-2 mt-2">
															{repo.language && (
																<span
																	className={`px-2 py-0.5 rounded-full text-xs ${
																		languageColors[repo.language]
																			? `${languageColors[repo.language].bg} ${
																					languageColors[repo.language].text
																			  }`
																			: "bg-sky-100 text-primary"
																	}`}
																>
																	{repo.language}
																</span>
															)}

															{/* Stars count */}
															{repo.stargazersCount > 0 && (
																<>
																	{repo.language && (
																		<span className="text-sm text-muted-foreground">•</span>
																	)}
																	<span className="flex items-center gap-1 text-sm text-muted-foreground">
																		<Star className="w-4 h-4" />
																		{repo.stargazersCount}
																	</span>
																</>
															)}

															{/* Forks count */}
															{repo.forksCount > 0 && (
																<>
																	{(repo.language || repo.stargazersCount > 0) && (
																		<span className="text-sm text-muted-foreground">•</span>
																	)}
																	<span className="flex items-center gap-1 text-sm text-muted-foreground">
																		<GitFork className="w-4 h-4" />
																		{repo.forksCount}
																	</span>
																</>
															)}

															{/* Updated date */}
															{(repo.language || repo.stargazersCount > 0 || repo.forksCount > 0) && (
																<span className="text-sm text-muted-foreground">•</span>
															)}
															<span className="text-sm text-muted-foreground whitespace-nowrap">
																Updated {new Date(repo.updatedAt).toLocaleDateString()}
															</span>
														</div>
													</div>
												</div>
											</li>
										))}
									</ul>
								) : (
									<div className="text-center text-muted-foreground py-8">
										No repositories found
									</div>
								)}
							</div>

							{/* Pagination - fixed at bottom with border for separation */}
							{filteredRepositories.length > 0 && (
								<div className="flex-shrink-0 flex justify-center items-center space-x-2 py-4 border-t border-border mt-auto">
									<Button
										variant="outline"
										size="icon"
										onClick={() => setCurrentPage(currentPage - 1)}
										disabled={currentPage === 1}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>

									<div className="flex items-center space-x-1">
										{totalPages <= 5 ? (
											// If 5 or fewer pages, show all page buttons
											Array.from({ length: totalPages }, (_, i) => i + 1).map(
												(page) => (
													<Button
														key={page}
														variant={
															currentPage === page ? "default" : "outline"
														}
														size="sm"
														onClick={() => setCurrentPage(page)}
														className={
															currentPage === page
																? "bg-primary text-primary-foreground"
																: ""
														}
													>
														{page}
													</Button>
												)
											)
										) : (
											// For more than 5 pages, use a simple design with max 5 buttons
											<>
												{/* First page is always shown */}
												<Button
													key={1}
													variant={currentPage === 1 ? "default" : "outline"}
													size="sm"
													onClick={() => setCurrentPage(1)}
													className={
														currentPage === 1
															? "bg-primary text-primary-foreground"
															: ""
													}
												>
													1
												</Button>

												{/* Show ellipsis when not near the start */}
												{currentPage > 3 && (
													<Button
														variant="outline"
														size="sm"
														disabled
														className="cursor-default"
													>
														...
													</Button>
												)}

												{/* Middle pages */}
												{Array.from({ length: totalPages }, (_, i) => i + 1)
													.filter((page) => {
														if (currentPage <= 3) {
															// Near start: show pages 2, 3
															return page > 1 && page < 4;
														} else if (currentPage >= totalPages - 2) {
															// Near end: show pages totalPages-2, totalPages-1
															return page > totalPages - 3 && page < totalPages;
														} else {
															// In middle: just show current page
															return page === currentPage;
														}
													})
													.map((page) => (
														<Button
															key={page}
															variant={
																currentPage === page ? "default" : "outline"
															}
															size="sm"
															onClick={() => setCurrentPage(page)}
															className={
																currentPage === page
																	? "bg-primary text-primary-foreground"
																	: ""
															}
														>
															{page}
														</Button>
													))}

												{/* Show ellipsis when not near the end */}
												{currentPage < totalPages - 2 && (
													<Button
														variant="outline"
														size="sm"
														disabled
														className="cursor-default"
													>
														...
													</Button>
												)}

												{/* Last page is always shown */}
												<Button
													key={totalPages}
													variant={
														currentPage === totalPages ? "default" : "outline"
													}
													size="sm"
													onClick={() => setCurrentPage(totalPages)}
													className={
														currentPage === totalPages
															? "bg-primary text-primary-foreground"
															: ""
													}
												>
													{totalPages}
												</Button>
											</>
										)}
									</div>

									<Button
										variant="outline"
										size="icon"
										onClick={() => setCurrentPage(currentPage + 1)}
										disabled={currentPage === totalPages}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>

									<div className="text-sm text-muted-foreground ml-2">
										Page {currentPage} of {totalPages} (
										{filteredRepositories.length} repositories)
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
