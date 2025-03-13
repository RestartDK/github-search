import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { expect, userEvent, within } from "@storybook/test";

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      // Reset localStorage before each story to prevent theme persistence
      localStorage.removeItem("vite-ui-theme");
      
      return (
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Navbar
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check if logo is present
    const logo = canvas.getByText("GitHub Search");
    expect(logo).toBeInTheDocument();
    
    // Check if theme toggle is present
    const themeToggle = canvas.getByRole("button", { name: "Toggle theme" });
    expect(themeToggle).toBeInTheDocument();
  },
};

// Interactive test that shows theme switching
export const ThemeSwitching: Story = {
  decorators: [
    (Story) => {
      // Start with light theme
      localStorage.setItem("vite-ui-theme", "light");
      
      return (
        <ThemeProvider defaultTheme="light">
          <Story />
        </ThemeProvider>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check if theme toggle is present
    const themeToggle = canvas.getByRole("button", { name: "Toggle theme" });
    expect(themeToggle).toBeInTheDocument();
    
    // Initially should be light theme
    const rootElement = document.documentElement;
    expect(rootElement.classList.contains("light")).toBe(true);
    
    // Click the theme toggle button to open the dropdown
    await userEvent.click(themeToggle);
    
    // Wait for dropdown to appear
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Find the Dark option and click it
    const menu = document.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    
    if (menu) {
      const darkOption = within(menu as HTMLElement).getByText("Dark");
      await userEvent.click(darkOption);
      
      // Wait for theme to change
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // Check that the root has the dark class
      expect(rootElement.classList.contains("dark")).toBe(true);
    }
  },
};