import type { Meta, StoryObj } from "@storybook/react";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { expect, userEvent, within } from "@storybook/test";

const meta = {
	title: "Components/ModeToggle",
	component: ModeToggle,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="flex p-10 justify-center">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;


// Interactive test switching between themes
export const Interactive: Story = {
	decorators: [
		(Story) => (
			<ThemeProvider defaultTheme="light">
				<div className="flex p-10 justify-center">
					<Story />
				</div>
			</ThemeProvider>
		),
	],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Find and click the theme button
		const themeButton = canvas.getByRole("button", { name: "Toggle theme" });
		await userEvent.click(themeButton);

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
			const rootElement = document.documentElement;
			expect(rootElement.classList.contains("dark")).toBe(true);
		}
	},
};