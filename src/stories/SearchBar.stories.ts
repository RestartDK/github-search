import { SearchBar } from "@/components/search-bar";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";

const meta = {
	component: SearchBar,
	title: "Components/SearchBar",
	tags: ["autodocs"],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default empty state
export const Empty: Story = {
	args: {
		users: [],
		isLoading: false,
		searchQuery: "",
		onSearch: () => {},
		onUserSelect: () => {},
	},
};

// Loading state
export const Loading: Story = {
	args: {
		users: [],
		isLoading: true,
		searchQuery: "",
		onSearch: () => {},
		onUserSelect: () => {},
	},
};

// With search results
export const WithResults: Story = {
	args: {
		users: [
			{
				id: 1,
				login: "reactjs",
				avatarUrl: "https://avatars.githubusercontent.com/u/6412038?v=4",
				url: "https://api.github.com/users/reactjs",
				htmlUrl: "https://github.com/reactjs",
				followersUrl: "https://api.github.com/users/reactjs/followers",
				followingUrl:
					"https://api.github.com/users/reactjs/following{/other_user}",
				gistsUrl: "https://api.github.com/users/reactjs/gists{/gist_id}",
				starredUrl:
					"https://api.github.com/users/reactjs/starred{/owner}{/repo}",
				subscriptionsUrl: "https://api.github.com/users/reactjs/subscriptions",
				organizationsUrl: "https://api.github.com/users/reactjs/orgs",
				reposUrl: "https://api.github.com/users/reactjs/repos",
				eventsUrl: "https://api.github.com/users/reactjs/events{/privacy}",
				receivedEventsUrl:
					"https://api.github.com/users/reactjs/received_events",
				type: "Organization",
				siteAdmin: false,
				score: 1,
			},
			{
				id: 2,
				login: "facebook",
				avatarUrl: "https://avatars.githubusercontent.com/u/69631?v=4",
				url: "https://api.github.com/users/facebook",
				htmlUrl: "https://github.com/facebook",
				followersUrl: "https://api.github.com/users/facebook/followers",
				followingUrl:
					"https://api.github.com/users/facebook/following{/other_user}",
				gistsUrl: "https://api.github.com/users/facebook/gists{/gist_id}",
				starredUrl:
					"https://api.github.com/users/facebook/starred{/owner}{/repo}",
				subscriptionsUrl: "https://api.github.com/users/facebook/subscriptions",
				organizationsUrl: "https://api.github.com/users/facebook/orgs",
				reposUrl: "https://api.github.com/users/facebook/repos",
				eventsUrl: "https://api.github.com/users/facebook/events{/privacy}",
				receivedEventsUrl:
					"https://api.github.com/users/facebook/received_events",
				type: "Organization",
				siteAdmin: false,
				score: 0.9,
			},
			{
				id: 3,
				login: "vercel",
				avatarUrl: "https://avatars.githubusercontent.com/u/14985020?v=4",
				url: "https://api.github.com/users/vercel",
				htmlUrl: "https://github.com/vercel",
				followersUrl: "https://api.github.com/users/vercel/followers",
				followingUrl:
					"https://api.github.com/users/vercel/following{/other_user}",
				gistsUrl: "https://api.github.com/users/vercel/gists{/gist_id}",
				starredUrl:
					"https://api.github.com/users/vercel/starred{/owner}{/repo}",
				subscriptionsUrl: "https://api.github.com/users/vercel/subscriptions",
				organizationsUrl: "https://api.github.com/users/vercel/orgs",
				reposUrl: "https://api.github.com/users/vercel/repos",
				eventsUrl: "https://api.github.com/users/vercel/events{/privacy}",
				receivedEventsUrl:
					"https://api.github.com/users/vercel/received_events",
				type: "Organization",
				siteAdmin: false,
				score: 0.8,
			},
		],
		searchQuery: "rea",
		isLoading: false,
		error: undefined,
		onSearch: () => {},
		onUserSelect: () => {},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Using a more precise selector to get just the username element
		const firstResult = canvas.getByText("reactjs", {
			selector: "span.font-medium",
		});
		expect(firstResult).toBeInTheDocument();

		// Simulate selecting a result
		await userEvent.click(firstResult);
	},
};

// Interactive story
export const Interactive: Story = {
	args: {
		users: [],
		isLoading: false,
		searchQuery: "",
		onSearch: () => {},
		onUserSelect: () => {},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Find the input and type in it
		const input = canvas.getByPlaceholderText("Search github username...");
		await userEvent.type(input, "rea");

		// Just verify the input exists and no errors occur
		expect(input).toBeInTheDocument();
	},
};
