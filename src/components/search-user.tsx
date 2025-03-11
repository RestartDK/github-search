// TODO: Remove the error conditional better to use some toast
import { useState } from "react";
import {
	Command,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { UserData } from "@/types";
import { X } from "lucide-react";

interface SearchUserProps {
	users?: UserData[];
	isLoading: boolean;
	error?: Error;
	onSearch: (query: string) => void;
}

export function SearchUser({
	users,
	isLoading,
	error,
	onSearch,
}: SearchUserProps) {
	const [inputValue, setInputValue] = useState("");

	const handleValueChange = (value: string) => {
		setInputValue(value);
		onSearch(value);
	};

	return (
		<Command className="rounded-lg border shadow-md md:min-w-[450px]">
			<div className="relative">
				<CommandInput
					placeholder="Search github username..."
					value={inputValue}
					onValueChange={handleValueChange}
				/>
				{inputValue && (
					<button
						onClick={() => {
							setInputValue("");
							onSearch("");
						}}
						className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/50 hover:text-muted-foreground cursor-pointer"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>
			<CommandList>
				{isLoading && <div className="p-4 text-center">Loading...</div>}
				{error && (
					<div className="p-4 text-center text-red-500">
						Error: {error.message}
					</div>
				)}
				{users && users.length > 0
					? users.map((user) => (
							<CommandItem key={user.id} value={user.login}>
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
		</Command>
	);
}
