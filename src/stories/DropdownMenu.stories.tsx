import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";
import { ThemeProvider } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components/UI/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="flex items-center justify-center p-10">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic dropdown menu
export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find the button and click it
    const button = canvas.getByRole("button", { name: "Open Menu" });
    await userEvent.click(button);
    
    // Wait for dropdown to appear
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Check if dropdown items are visible
    const menu = document.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    
    if (menu) {
      const menuItems = within(menu as HTMLElement).getAllByRole("menuitem");
      expect(menuItems).toHaveLength(4); // Profile, Settings, Help, Logout
      expect(within(menu as HTMLElement).getByText("Profile")).toBeInTheDocument();
    }
  },
};

// Dropdown with Checkboxes
export const WithCheckboxes: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Show Public</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Show Private</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Show Archived</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find the button and click it
    const button = canvas.getByRole("button", { name: "Filter Options" });
    await userEvent.click(button);
    
    // Wait for dropdown to appear
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Check if dropdown items are visible
    const menu = document.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    
    if (menu) {
      const menuItems = within(menu as HTMLElement).getAllByRole("menuitemcheckbox");
      expect(menuItems).toHaveLength(3);
      
      // Check if first item is checked
      const firstCheckbox = menuItems[0];
      expect(firstCheckbox).toHaveAttribute("data-state", "checked");
    }
  },
};

// Dropdown with Nested Submenus
export const WithSubmenus: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Advanced Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>Dashboard</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Notifications</DropdownMenuItem>
            <DropdownMenuItem>Security</DropdownMenuItem>
            <DropdownMenuItem>API Keys</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find the button and click it
    const button = canvas.getByRole("button", { name: "Advanced Menu" });
    await userEvent.click(button);
    
    // Wait for dropdown to appear
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Find and click the submenu trigger
    const submenuTrigger = document.querySelector('[role="menuitem"][data-state="closed"]');
    expect(submenuTrigger).not.toBeNull();
    
    if (submenuTrigger) {
      await userEvent.click(submenuTrigger as HTMLElement);
      
      // Wait for submenu to appear
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // Check for submenu items
      const submenus = document.querySelectorAll('[role="menu"]');
      expect(submenus.length).toBeGreaterThan(1);
    }
  },
}; 