/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Home from "../page";
import axios from "axios";

// Mock Axios
jest.mock("axios");

// Mock Next.js Link
jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

describe("Home Page", () => {
  const mockEvents = [
    {
      title: "Tech Conference 2025",
      date: "2025-09-01",
      location: "Bangalore",
      image: "https://example.com/image.jpg",
    },
    {
      title: "Startup Meetup",
      date: "2025-10-10",
      location: "Delhi",
      image: "https://example.com/startup.jpg",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockEvents });
  });

  it("renders headings and search bar", async () => {
    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByText("Find & Register for Top Events!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search for events...")).toBeInTheDocument();
  });

  it("fetches and displays event cards from API", async () => {
    await act(async () => {
      render(<Home />);
    });

    expect(await screen.findByText("Tech Conference 2025")).toBeInTheDocument();
    expect(screen.getByText("Startup Meetup")).toBeInTheDocument();
  });

  it("filters events when typing into search box", async () => {
    await act(async () => {
      render(<Home />);
    });

    const input = screen.getByPlaceholderText("Search for events...");
    fireEvent.change(input, { target: { value: "tech" } });

    expect(screen.queryByText("Startup Meetup")).not.toBeInTheDocument();
    expect(screen.getByText("Tech Conference 2025")).toBeInTheDocument();
  });

  it("renders Register Now button with correct link", async () => {
    await act(async () => {
      render(<Home />);
    });

    const links = await screen.findAllByRole("link", { name: /Register Now/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", "/register");
  });

  it("displays fallback image if image load fails", async () => {
    await act(async () => {
      render(<Home />);
    });

    const images = await screen.findAllByRole("img");
    fireEvent.error(images[0]);

    await waitFor(() => {
      expect(images[0].src).toContain("/default-event.jpg");
    });
  });
});
