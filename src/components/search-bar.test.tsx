import { screen } from "@testing-library/react";
import { composeStories } from "@storybook/react";
import * as stories from "../stories/SearchBar.stories";
import { describe, test, expect, vi } from "vitest";
import { userEvent } from "@vitest/browser/context";

// Compose all stories for testing
const { Empty, Loading, WithResults, Interactive } = composeStories(stories);

describe("SearchBar", () => {
	// Test the Empty state
	test("renders empty search bar", async () => {
		await Empty.run();
		const inputElement = screen.getByPlaceholderText(
			"Search github username..."
		);
		expect(inputElement).toBeInTheDocument();
		expect(screen.queryByRole("list")).not.toBeInTheDocument(); // No results list
	});

	// Test the Loading state
	test("displays loading indicator when loading", async () => {
		await Loading.run();
		expect(document.querySelector(".animate-spin")).toBeInTheDocument();
	});

	// Test the WithResults state
	test("shows search results when available", async () => {
		await WithResults.run();
		expect(screen.getByText("reactjs")).toBeInTheDocument();
		expect(screen.getByText("facebook")).toBeInTheDocument();
		expect(screen.getByText("vercel")).toBeInTheDocument();
	});

	// Test user selection
	test("calls onUserSelect when a result is clicked", async () => {
		const onUserSelectMock = vi.fn();
		await WithResults.run({ args: { onUserSelect: onUserSelectMock } });

		await userEvent.click(screen.getByText("reactjs"));

		expect(onUserSelectMock).toHaveBeenCalled();
	});

	// Test search input
	test("calls onSearch when typing in the input", async () => {
		const onSearchMock = vi.fn();
		await Empty.run({ args: { onSearch: onSearchMock } });

		const input = screen.getByPlaceholderText("Search github username...");
		await userEvent.type(input, "test");

		expect(onSearchMock).toHaveBeenCalledWith("test");
	});

	// Test clear button
	test("clears search when X button is clicked", async () => {
		const onSearchMock = vi.fn();
		await WithResults.run({ args: { onSearch: onSearchMock } });

		const clearButton = screen.getByRole("button");
		await userEvent.click(clearButton);

		expect(onSearchMock).toHaveBeenCalledWith("");
	});

	// Test Interactive story
	test("executes the Interactive story correctly", async () => {
		const onSearchMock = vi.fn();
		await Interactive.run({ args: { onSearch: onSearchMock } });
		
		// The play function should have typed 'rea' in the input
		expect(onSearchMock).toHaveBeenCalledWith('rea');
	});
});
