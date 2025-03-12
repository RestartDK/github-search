import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UserData } from "@/types";

interface SearchUserProps {
	users?: UserData[];
	isLoading: boolean;
	error?: Error;
	searchQuery: string;
	onSearch: (query: string) => void;
	onUserSelect: (user: UserData) => void;
}

export function SearchBar({
	users = [],
	isLoading,
	error,
	searchQuery,
	onSearch,
	onUserSelect,
}: SearchUserProps) {
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [showResults, setShowResults] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Reset selected index when search results change
	useEffect(() => {
		setSelectedIndex(-1);
	}, [users]);

	// Show results when there's a search query and users
	useEffect(() => {
		if (searchQuery.trim() && users && users.length > 0) {
			setShowResults(true);
		} else if (!searchQuery.trim()) {
			setShowResults(false);
		}
	}, [searchQuery, users]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				console.log("Click detected outside search component");
				setShowResults(false);
			}
		};

		// Add the event listener to the document
		document.addEventListener("mousedown", handleClickOutside);
		
		// Clean up the event listener when the component unmounts
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!users || users.length === 0) return;

		// Arrow down
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev < users.length - 1 ? prev + 1 : prev));
			setShowResults(true);
		}
		// Arrow up
		else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
			setShowResults(true);
		}
		// Enter
		else if (e.key === "Enter") {
			e.preventDefault();
			if (selectedIndex >= 0 && users[selectedIndex]) {
				handleUserSelect(users[selectedIndex]);
			}
		}
		// Escape
		else if (e.key === "Escape") {
			setShowResults(false);
			inputRef.current?.blur();
		}
	};

	const handleUserSelect = (user: UserData) => {
		onUserSelect(user);
		onSearch(user.login);
		setShowResults(false);
	};

	const handleClearSearch = () => {
		onSearch("");
		setShowResults(false);
	};

	// Handle blur event as a backup method
	const handleBlur = (e: React.FocusEvent) => {
		// Small delay to allow click events on results to register first
		setTimeout(() => {
			// Check if the related target is inside the search component
			if (!searchRef.current?.contains(e.relatedTarget as Node)) {
				setShowResults(false);
			}
		}, 100);
	};

	// Debug output
	console.log("SearchBar rendering:", {
		searchQuery,
		usersLength: users?.length,
		showResults,
		selectedIndex
	});

	return (
		<div className="relative w-full" ref={searchRef}>
			<div className="relative flex h-10 items-center border rounded-md">
				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					{isLoading ? (
						<Loader2 className="h-4 w-4 shrink-0 opacity-50 animate-spin" />
					) : (
						<Search className="h-4 w-4 shrink-0 opacity-50" />
					)}
				</div>
				<Input
					ref={inputRef}
					type="text"
					placeholder="Search github username..."
					className="pl-9 pr-9 py-2 h-10 text-sm bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
					value={searchQuery}
					onChange={(e) => onSearch(e.target.value)}
					onFocus={() => {
						if (searchQuery.trim() && users && users.length > 0) {
							setShowResults(true);
						}
					}}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
				/>
				{searchQuery && (
					<button
						onClick={handleClearSearch}
						className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>

			{/* Only show results if showResults state is true */}
			{showResults && searchQuery.trim() && users && users.length > 0 && (
				<div className="absolute mt-1 w-full bg-popover text-popover-foreground rounded-md shadow-md border z-10 max-h-[300px] overflow-y-auto">
					<ul className="py-1 overflow-hidden">
						{users.map((user, index) => (
							<li key={user.id}>
								<button
									type="button"
									className={cn(
										"w-full px-2 py-1.5 flex items-center gap-2 text-sm outline-hidden select-none",
										selectedIndex === index 
											? "bg-accent text-accent-foreground" 
											: "hover:bg-accent/50 hover:text-accent-foreground"
									)}
									onMouseEnter={() => setSelectedIndex(index)}
									onClick={() => handleUserSelect(user)}
								>
									<div className="flex items-center gap-x-2">
										<div className="h-6 w-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
											<img src={user.avatarUrl} alt={user.login} className="h-full w-full object-cover" />
										</div>
										<div className="flex flex-col">
											<span className="font-medium">{user.login}</span>
											<span className="text-xs text-muted-foreground">
												{user.htmlUrl.replace("https://github.com/", "")}
											</span>
										</div>
									</div>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{showResults && searchQuery && (!users || users.length === 0) && !isLoading && (
				<div className="absolute mt-1 w-full bg-popover text-popover-foreground rounded-md shadow-md border z-10">
					<div className="px-2 py-6 text-center text-sm text-muted-foreground">
						No results found for "{searchQuery}"
					</div>
				</div>
			)}

			{showResults && error && (
				<div className="absolute mt-1 w-full bg-popover text-popover-foreground rounded-md shadow-md border z-10">
					<div className="px-2 py-3 text-sm text-destructive">
						Error: {error.message}
					</div>
				</div>
			)}
		</div>
	);
}
