// TODO: Remove the error conditional better to use some toast
import {
	Command,
	CommandInput,
	CommandItem,
	CommandList,
	CommandEmpty,
} from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { UserData } from "@/types";
import { X, Loader2, SearchIcon } from "lucide-react";
import { useState } from "react";

interface SearchUserProps {
	users?: UserData[];
	isLoading: boolean;
	error?: Error;
	searchQuery: string;
	onSearch: (query: string) => void;
	onUserSelect: (user: UserData) => void;
}

export function SearchUser({
	users,
	isLoading,
	error,
	searchQuery,
	onSearch,
	onUserSelect,
}: SearchUserProps) {
	const [open, setOpen] = useState(false);

	return (
		<Command
			className="rounded-lg border shadow-md md:min-w-[450px]"
			shouldFilter={false}
			loop
			// onBlur={() => setOpen(false)}
		>
			<div className="relative">
				<CommandInput
					placeholder="Search github username..."
					value={searchQuery}
					onValueChange={onSearch}
					onFocus={() => setOpen(true)}
					icon={
						isLoading ? (
							<Loader2 className="size-4 shrink-0 opacity-50 animate-spin" />
						) : (
							<SearchIcon className="size-4 shrink-0 opacity-50" />
						)
					}
				/>
				{searchQuery && (
					<button
						onClick={() => onSearch("")}
						className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/50 hover:text-muted-foreground cursor-pointer"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>
			{open && (
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					{error && (
						<div className="p-4 text-center text-red-500">
							Error: {error.message}
						</div>
					)}
					{users && users.length > 0
						? users.map((user) => (
								<CommandItem
									key={user.id}
									value={user.login}
									onSelect={() => {
										setOpen(false);
										// FIXME: This part is causing errors
										// onSearch(user.login);
										console.log(searchQuery);
										setTimeout(() => {
											onUserSelect(user);
										});
									}}
									className="cursor-pointer"
								>
									<div className="flex items-center gap-x-2">
										<Avatar className="h-10 w-10">
											<AvatarImage src={user.avatarUrl} alt={user.login} />
											<AvatarFallback>
												{user.login.substring(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											<span className="text-sm font-medium">{user.login}</span>
											<span className="text-sm font-normal text-muted-foreground">
												{user.htmlUrl.replace("https://github.com/", "")}
											</span>
										</div>
									</div>
								</CommandItem>
						  ))
						: null}
				</CommandList>
			)}
		</Command>
	);
}
