import type { Meta, StoryObj } from "@storybook/react";
import Home from "@/components/home";
import { expect, within } from "@storybook/test";
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
  }
];

const meta = {
  title: "Components/Home",
  component: Home,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    // Add mock service worker handlers if needed for API mocking
    // msw: {
    //   handlers: [
    //     rest.get('*/api/github/search', (req, res, ctx) => {
    //       return res(ctx.json(mockUsers))
    //     }),
    //   ]
    // }
  },
  // Wrap component in ThemeProvider since it uses theme-dependent components
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story showing initial empty state
export const Default: Story = {};

// Story showing search results
export const WithSearchResults: Story = {
  parameters: {
    // We would need msw or another mocking solution to properly test this component's behavior
    // This story will not work properly without proper API mocking
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Wait for component to render
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Verify the search input exists
    const searchInput = canvas.getByPlaceholderText("Search github username...");
    expect(searchInput).toBeInTheDocument();
    
    // Basic element verification
    expect(canvas.getByText("Github Search")).toBeInTheDocument();
  },
};

// This is a placeholder - in a real implementation you would need API mocking
// to make these stories work properly
export const WithProfileView: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Wait for component to render
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Basic element verification
    expect(canvas.getByText("Github Search")).toBeInTheDocument();
  },
}; 