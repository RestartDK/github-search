import type { Meta, StoryObj } from "@storybook/react";
import Home from "@/components/home";
import { expect, within, userEvent } from "@storybook/test";
import { ThemeProvider } from "@/components/theme-provider";

// Mock data for stories
const mockUsers = [
  {
    id: 1,
    login: "testuser",
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    url: "https://api.github.com/users/testuser",
    htmlUrl: "https://github.com/testuser",
    type: "User",
    score: 1
  },
  {
    id: 2,
    login: "octocat",
    avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    url: "https://api.github.com/users/octocat",
    htmlUrl: "https://github.com/octocat",
    type: "User",
    score: 0.8
  },
  {
    id: 3,
    login: "testorg",
    avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    url: "https://api.github.com/users/testorg",
    htmlUrl: "https://github.com/testorg",
    type: "Organization",
    score: 0.7
  }
];

const mockProfile = {
  login: "testuser",
  id: 1,
  name: "Test User",
  avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
  bio: "Test bio",
  company: "@testcompany",
  location: "Test City",
  blog: "https://testuser.dev",
  followers: 100,
  following: 50,
  publicRepos: 30,
  publicGists: 5,
  totalStars: 500,
  totalCommits: 1000,
  totalPRs: 100,
  totalIssues: 50,
  htmlUrl: "https://github.com/testuser",
  twitterUsername: "testuser",
  createdAt: "2020-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
};

const mockRepositories = [
  {
    id: 1,
    name: "test-repo",
    fullName: "testuser/test-repo",
    htmlUrl: "https://github.com/testuser/test-repo",
    description: "A test repository",
    fork: false,
    createdAt: "2020-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    pushedAt: "2023-01-01T00:00:00Z",
    stargazersCount: 100,
    watchersCount: 10,
    language: "TypeScript",
    forksCount: 20,
    openIssuesCount: 5,
    topics: ["test", "storybook"]
  },
  {
    id: 2,
    name: "react-app",
    fullName: "testuser/react-app",
    htmlUrl: "https://github.com/testuser/react-app",
    description: "A React application",
    fork: false,
    createdAt: "2021-03-15T00:00:00Z",
    updatedAt: "2023-02-10T00:00:00Z",
    pushedAt: "2023-02-10T00:00:00Z",
    stargazersCount: 85,
    watchersCount: 7,
    language: "JavaScript",
    forksCount: 15,
    openIssuesCount: 3,
    topics: ["react", "javascript"]
  }
];

// For a proper implementation, you would need to:
// 1. Install MSW for API mocking in Storybook: npm install msw msw-storybook-addon --save-dev
// 2. Setup MSW in your .storybook/preview.js
// 3. Use the MSW handlers to mock the API endpoints

const meta = {
  title: "Components/Home",
  component: Home,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    mockData: {
      users: mockUsers,
      profile: mockProfile,
      repositories: mockRepositories
    }
  },
  // Wrap component in ThemeProvider since it uses theme-dependent components
  decorators: [
    (Story) => {
      // Reset localStorage before each story to ensure consistent state
      localStorage.removeItem("vite-ui-theme");
      
      return (
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      );
    },
  ],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story showing initial empty state
export const Default: Story = {};

// Story showing search results
export const WithSearchResults: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Wait for component to render
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Find the search input
    const searchInput = canvas.getByPlaceholderText("Search github username...");
    expect(searchInput).toBeInTheDocument();
    
    // Type 'test' in the search input
    await userEvent.type(searchInput, 'test');
    
    // Wait for search results to appear
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Verify the search input exists
    expect(canvas.getByText("Github Search")).toBeInTheDocument();
    
    // Note: Without proper API mocking, we can't verify the dropdown results.
    // In a real implementation with MSW, we could verify the results are displayed.
  },
};