import type { Meta, StoryObj } from "@storybook/react";
import {
	userEvent,
	within,
	expect,
} from "@storybook/test";
import GitHubProfile from "@/components/github-profile";
import { Profile, Repository } from "@/types";

// Mock data for stories
const mockProfile: Profile = {
	login: "johndoe",
	id: 12345,
	name: "John Doe",
	avatarUrl: "https://avatars.githubusercontent.com/u/1234567?v=4",
	bio: "Full-stack developer passionate about open source and web technologies",
	company: "@awesome-company",
	location: "San Francisco, CA",
	email: "john@example.com",
	blog: "https://johndoe.dev",
	followers: 580,
	following: 128,
	publicRepos: 45,
	publicGists: 15,
	totalStars: 1250,
	totalCommits: 3478,
	totalPRs: 287,
	totalIssues: 142,
	htmlUrl: "https://github.com/johndoe",
	twitterUsername: "johndoedev",
	createdAt: "2015-01-01T00:00:00Z",
	updatedAt: "2023-08-01T00:00:00Z",
};

// Create mock repositories with different properties
const mockRepositories: Repository[] = [
	{
		id: 1,
		name: "awesome-react",
		fullName: "johndoe/awesome-react",
		htmlUrl: "https://github.com/johndoe/awesome-react",
		description:
			"A curated list of awesome React libraries, tools, and resources",
		fork: false,
		createdAt: "2023-01-15T10:30:45Z",
		updatedAt: "2023-07-20T15:45:22Z",
		pushedAt: "2023-07-20T15:45:22Z",
		stargazersCount: 560,
		watchersCount: 42,
		language: "JavaScript",
		forksCount: 120,
		openIssuesCount: 5,
		topics: ["react", "javascript", "frontend"],
	},
	{
		id: 2,
		name: "next-blog-starter",
		fullName: "johndoe/next-blog-starter",
		htmlUrl: "https://github.com/johndoe/next-blog-starter",
		description:
			"A starter template for building blogs with Next.js and Tailwind CSS",
		fork: false,
		createdAt: "2023-03-25T09:12:33Z",
		updatedAt: "2023-07-18T11:24:15Z",
		pushedAt: "2023-07-18T11:24:15Z",
		stargazersCount: 320,
		watchersCount: 28,
		language: "TypeScript",
		forksCount: 85,
		openIssuesCount: 3,
		topics: ["nextjs", "tailwindcss", "blog"],
	},
	{
		id: 3,
		name: "react-native-components",
		fullName: "johndoe/react-native-components",
		htmlUrl: "https://github.com/johndoe/react-native-components",
		description:
			"A collection of reusable React Native components built with TypeScript",
		fork: false,
		createdAt: "2023-02-10T14:22:18Z",
		updatedAt: "2023-07-15T16:33:42Z",
		pushedAt: "2023-07-15T16:33:42Z",
		stargazersCount: 180,
		watchersCount: 15,
		language: "TypeScript",
		forksCount: 45,
		openIssuesCount: 8,
		topics: ["react-native", "mobile", "components"],
	},
	{
		id: 4,
		name: "node-api-boilerplate",
		fullName: "johndoe/node-api-boilerplate",
		htmlUrl: "https://github.com/johndoe/node-api-boilerplate",
		description:
			"A boilerplate for building RESTful APIs with Node.js, Express, and MongoDB",
		fork: false,
		createdAt: "2022-12-05T08:45:10Z",
		updatedAt: "2023-07-10T13:15:30Z",
		pushedAt: "2023-07-10T13:15:30Z",
		stargazersCount: 120,
		watchersCount: 10,
		language: "JavaScript",
		forksCount: 35,
		openIssuesCount: 2,
		topics: ["nodejs", "express", "mongodb", "api"],
	},
	{
		id: 5,
		name: "python-data-science",
		fullName: "johndoe/python-data-science",
		htmlUrl: "https://github.com/johndoe/python-data-science",
		description:
			"Python examples and notebooks for data science and machine learning",
		fork: false,
		createdAt: "2023-04-18T11:20:45Z",
		updatedAt: "2023-07-05T09:30:15Z",
		pushedAt: "2023-07-05T09:30:15Z",
		stargazersCount: 70,
		watchersCount: 8,
		language: "Python",
		forksCount: 25,
		openIssuesCount: 4,
		topics: ["python", "data-science", "machine-learning"],
	},
	{
		id: 6,
		name: "go-microservices",
		fullName: "johndoe/go-microservices",
		htmlUrl: "https://github.com/johndoe/go-microservices",
		description:
			"A demonstration of microservices architecture using Go and Docker",
		fork: false,
		createdAt: "2023-05-20T10:15:30Z",
		updatedAt: "2023-06-28T14:20:45Z",
		pushedAt: "2023-06-28T14:20:45Z",
		stargazersCount: 90,
		watchersCount: 12,
		language: "Go",
		forksCount: 30,
		openIssuesCount: 6,
		topics: ["go", "microservices", "docker"],
	},
	{
		id: 7,
		name: "vue-dashboard",
		fullName: "awesome-org/vue-dashboard",
		htmlUrl: "https://github.com/awesome-org/vue-dashboard",
		description: "An admin dashboard built with Vue.js and Tailwind CSS",
		fork: true, // This is a forked repo
		createdAt: "2023-06-10T13:40:22Z",
		updatedAt: "2023-06-20T15:10:33Z",
		pushedAt: "2023-06-20T15:10:33Z",
		stargazersCount: 0, // No stars for their fork
		watchersCount: 1,
		language: "Vue",
		forksCount: 0,
		openIssuesCount: 0,
		topics: ["vue", "dashboard", "tailwindcss"],
	},
];

// Additional forked repo for WithForkedRepos story
const forkedRepo: Repository = {
	id: 8,
	name: "react-native-navigation",
	fullName: "johndoe/react-native-navigation",
	htmlUrl: "https://github.com/johndoe/react-native-navigation",
	description:
		"A forked repository of a popular React Native navigation library",
	fork: true,
	createdAt: "2023-03-15T11:22:33Z",
	updatedAt: "2023-06-15T09:10:25Z",
	pushedAt: "2023-06-15T09:10:25Z",
	stargazersCount: 5,
	watchersCount: 1,
	language: "TypeScript",
	forksCount: 2,
	openIssuesCount: 0,
	topics: ["react-native", "navigation"],
};

// Additional forked repo for InteractiveFilterByType story
const forkedRouterRepo: Repository = {
	id: 9,
	name: "react-router",
	fullName: "johndoe/react-router",
	htmlUrl: "https://github.com/johndoe/react-router",
	description: "A forked repository of React Router",
	fork: true,
	createdAt: "2023-02-10T08:15:20Z",
	updatedAt: "2023-05-12T14:30:45Z",
	pushedAt: "2023-05-12T14:30:45Z",
	stargazersCount: 3,
	watchersCount: 1,
	language: "JavaScript",
	forksCount: 0,
	openIssuesCount: 0,
	topics: ["react", "router"],
};

const meta = {
	title: "Components/GitHubProfile",
	component: GitHubProfile,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof GitHubProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with full data
export const Default: Story = {
	args: {
		profile: mockProfile,
		repositories: mockRepositories,
	},
};

// Profile with no repositories
export const NoRepositories: Story = {
	args: {
		profile: mockProfile,
		repositories: [],
	},
};

// Profile with forked repositories
export const WithForkedRepos: Story = {
	args: {
		profile: mockProfile,
		repositories: [...mockRepositories, forkedRepo],
	},
};

// Interactive story with search filter
export const InteractiveSearch: Story = {
	args: {
		profile: mockProfile,
		repositories: mockRepositories,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Wait for component to fully render
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Find the search input
		const searchInput = canvas.getByPlaceholderText("Search repositories...");
		expect(searchInput).toBeInTheDocument();

		// Type "react" into the search field
		await userEvent.type(searchInput, "react");

		// Verify that fewer repositories are shown (only ones containing "react")
		// Wait for the filtering to complete
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Only the react repositories should be visible now
		const repoItems = canvas.getAllByText(/react/i, { selector: "a.text-xl" });
		expect(repoItems.length).toBeGreaterThan(0);

		// Verify we can see "awesome-react" repository
		const awesomeReactRepo = canvas.getByText("awesome-react");
		expect(awesomeReactRepo).toBeInTheDocument();
	},
};

// Interactive story with filter by type
export const InteractiveFilterByType: Story = {
	args: {
		profile: mockProfile,
		repositories: [...mockRepositories, forkedRouterRepo],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Wait for component to fully render
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Open the dropdown
		const typeSelect = canvas.getAllByRole("combobox")[0];
		await userEvent.click(typeSelect);

		// Wait a moment for the dropdown to open
		await new Promise((resolve) => setTimeout(resolve, 100));

		const dropdownContent = document.querySelector(
			'[role="listbox"]'
		) as HTMLElement;
		if (!dropdownContent) throw new Error("Dropdown content not found");

		const forksOption = within(dropdownContent).getByText("Forks");
		await userEvent.click(forksOption);
	},
};

// Interactive story with language filter
export const InteractiveFilterByLanguage: Story = {
	args: {
		profile: mockProfile,
		repositories: mockRepositories,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Wait for component to fully render
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Open the language filter dropdown
		const languageFilterTrigger = canvas.getAllByRole("combobox")[1];
		await userEvent.click(languageFilterTrigger);

		// Wait for dropdown to open
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Select "TypeScript" option from the dropdown
		// Use a more specific selector to avoid multiple matches
		// Find the dropdown content and then find TypeScript within it
		const dropdownContent = document.querySelector(
			'[role="listbox"]'
		) as HTMLElement;
		if (!dropdownContent) throw new Error("Dropdown content not found");

		const typescriptOption = within(dropdownContent).getByText("TypeScript");
		await userEvent.click(typescriptOption);

		// Wait for filtering to apply
		await new Promise((resolve) => setTimeout(resolve, 200));

		// Now only TypeScript repositories should be visible
		// We should find TypeScript badges in language spans
		// Use a more specific selector to target just the language badges
		const typescriptBadges = canvas.getAllByText("TypeScript", {
			selector: 'span[class*="rounded-full"]',
		});
		expect(typescriptBadges.length).toBeGreaterThan(0);
	},
};

// Interactive story with pagination
export const InteractivePagination: Story = {
	args: {
		profile: mockProfile,
		repositories: Array.from({ length: 12 }, (_, i) => ({
			...mockRepositories[i % mockRepositories.length],
			id: i + 100, // Ensure unique IDs
			name: `repo-${i + 1}`, // Ensure unique names
			fullName: `johndoe/repo-${i + 1}`,
			htmlUrl: `https://github.com/johndoe/repo-${i + 1}`,
		})),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await new Promise((resolve) => setTimeout(resolve, 300));

		// Check if we're seeing the pagination controls
		const nextButton = canvas.getByRole("button", { name: "Next page" });
		expect(nextButton).toBeInTheDocument();

		// Click on next page button
		await userEvent.click(nextButton);

		await new Promise((resolve) => setTimeout(resolve, 200));

		// Also verify the page indicator using a regex pattern (matches "Page 2 of X")
		expect(canvas.getByText(/Page 2 of \d+/)).toBeInTheDocument();

		// Click on next page button again
		await userEvent.click(nextButton);

		await new Promise((resolve) => setTimeout(resolve, 200));
		
		// Verify the page indicator with regex
		expect(canvas.getByText(/Page 3 of \d+/)).toBeInTheDocument();

		// Now go back to page 2
		const prevButton = canvas.getByRole("button", { name: "Previous page" });
		await userEvent.click(prevButton);

		// Wait for page transition
		await new Promise((resolve) => setTimeout(resolve, 200));

		// We should be back on page 2
		expect(canvas.getByText(/Page 2 of \d+/)).toBeInTheDocument();
	},
};
