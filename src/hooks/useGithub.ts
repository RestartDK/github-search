import {
	Profile,
	Repository,
	SearchProfilesResponse,
	UseProfileResult,
} from "@/types";
import { useState, useEffect } from "react";
import { transformToCamelCase } from "@/lib/utils";

interface UseSearchProfilesProps {
	query: string;
	page?: number;
	per_page?: number;
	enabled?: boolean;
}

function getHeaders(): HeadersInit {
	const headers: HeadersInit = {
		Accept: "application/vnd.github.v3+json",
	};

	headers["Authorization"] = `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`;

	return headers;
}

export function useSearchProfiles({
	query,
	page = 1,
	per_page = 10,
	enabled = true,
}: UseSearchProfilesProps) {
	const [data, setData] = useState<SearchProfilesResponse | undefined>(
		undefined
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		async function fetchUsers() {
			if (!query.trim() || !enabled) {
				setData(undefined);
				return;
			}

			setIsLoading(true);
			setError(undefined);

			try {
				const response = await fetch(
					`${
						import.meta.env.VITE_GITHUB_URL
					}search/users?q=${encodeURIComponent(
						query
					)}&page=${page}&per_page=${per_page}`,
					{
						headers: getHeaders(),
						signal,
					}
				);

				if (!response.ok) {
					throw new Error(`GitHub API error: ${response.status}`);
				}

				const rawData = await response.json();
				// Transform snake_case to camelCase
				const transformedData =
					transformToCamelCase<SearchProfilesResponse>(rawData);
				setData(transformedData);
			} catch (err: unknown) {
				if ((err as { name?: string }).name !== "AbortError") {
					setError(err instanceof Error ? err : new Error(String(err)));
				}
			} finally {
				setIsLoading(false);
			}
		}

		fetchUsers();

		return () => {
			controller.abort();
		};
	}, [query, page, per_page, enabled]);

	return {
		data,
		isLoading,
		error,
		users: data?.items || [],
		totalCount: data?.totalCount || 0,
	};
}

export function useProfile(username: string): UseProfileResult {
	const [profile, setProfile] = useState<Profile | undefined>(undefined);
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		async function fetchProfile() {
			if (!username.trim()) {
				return;
			}

			setIsLoading(true);
			setError(undefined);

			try {
				// Fetch user profile
				const profileResponse = await fetch(
					`${import.meta.env.VITE_GITHUB_URL}users/${username}`,
					{
						headers: getHeaders(),
						signal,
					}
				);

				if (!profileResponse.ok) {
					throw new Error(`GitHub API error: ${profileResponse.status}`);
				}

				const profileRawData = await profileResponse.json();
				// Transform snake_case to camelCase
				const profileData = transformToCamelCase<Profile>(profileRawData);

				// Fetch repositories
				const reposResponse = await fetch(
					`${import.meta.env.VITE_GITHUB_URL}users/${username}/repos?per_page=100&sort=updated`,
					{
						headers: getHeaders(),
						signal,
					}
				);

				if (!reposResponse.ok) {
					throw new Error(`GitHub API error: ${reposResponse.status}`);
				}

				const reposRawData = await reposResponse.json();
				// Transform snake_case to camelCase
				const reposData = transformToCamelCase<Repository[]>(reposRawData);
				setRepositories(reposData);

				// Calculate repository stats
				const totalStars = reposData.reduce(
					(sum: number, repo: Repository) => sum + repo.stargazersCount,
					0
				);

				// Fetch user's events for commit count (last 100 events)
				const eventsResponse = await fetch(
					`${import.meta.env.VITE_GITHUB_URL}users/${username}/events?per_page=100`,
					{
						headers: getHeaders(),
						signal,
					}
				);

				if (!eventsResponse.ok) {
					throw new Error(`GitHub API error: ${eventsResponse.status}`);
				}

				const eventsData = await eventsResponse.json();
				const totalCommits = eventsData
					.filter((event: any) => event.type === 'PushEvent')
					.reduce((sum: number, event: any) => sum + (event.payload?.commits?.length || 0), 0);

				// Fetch user's PRs
				const prsResponse = await fetch(
					`${import.meta.env.VITE_GITHUB_URL}search/issues?q=author:${username}+type:pr`,
					{
						headers: getHeaders(),
						signal,
					}
				);

				if (!prsResponse.ok) {
					throw new Error(`GitHub API error: ${prsResponse.status}`);
				}

				const prsData = await prsResponse.json();
				const totalPRs = prsData.total_count || 0;

				// Fetch user's issues
				const issuesResponse = await fetch(
					`${import.meta.env.VITE_GITHUB_URL}search/issues?q=author:${username}+type:issue`,
					{
						headers: getHeaders(),
						signal,
					}
				);

				if (!issuesResponse.ok) {
					throw new Error(`GitHub API error: ${issuesResponse.status}`);
				}

				const issuesData = await issuesResponse.json();
				const totalIssues = issuesData.total_count || 0;

				// Update profile with all stats
				setProfile({
					...profileData,
					totalStars,
					totalCommits,
					totalPRs,
					totalIssues
				});

			} catch (err: unknown) {
				if ((err as { name?: string }).name !== "AbortError") {
					setError(err instanceof Error ? err : new Error(String(err)));
				}
			} finally {
				setIsLoading(false);
			}
		}

		fetchProfile();

		return () => {
			controller.abort();
		};
	}, [username]);

	return {
		profile,
		repositories,
		isLoading,
		error,
	};
}
