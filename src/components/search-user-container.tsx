import { useState } from "react";
import { SearchUser } from "@/components/search-user";
import { useSearchProfiles } from "@/hooks/useGithub";

export function SearchUserContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const { users, isLoading, error } = useSearchProfiles({
    query: searchQuery,
    enabled: searchQuery.trim().length > 0
  });

  return (
    <SearchUser 
      users={users}
      isLoading={isLoading}
      error={error}
      onSearch={setSearchQuery}
    />
  );
}