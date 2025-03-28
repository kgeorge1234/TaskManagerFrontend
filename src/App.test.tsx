import { it, expect, describe, beforeEach, afterEach, vi, Mocked } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';
import '@testing-library/jest-dom/vitest';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe("App Component", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          title: "Test Task",
          description: "Some description",
          dueDate: "2025-04-01",
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders tasks on mount", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });
  });

  it("adds a task", async () => {
    render(<App />);

    // Simulate input for the new task
    fireEvent.change(screen.getByPlaceholderText("Task Title"), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Task Description"), {
      target: { value: "Task Description" },
    });
    fireEvent.change(screen.getByPlaceholderText("YYYY-mm-dd"), {
      target: { value: "2025-05-01" },
    });
 

    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    // Click the "Add" button
    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
  });

  it("updates a task", async () => {
    render(<App />);

    await waitFor(() => screen.getByText("Test Task"));

    fireEvent.click(screen.getByText("Test Task"));
    
    fireEvent.change(screen.getByPlaceholderText("Task Title"), {
      target: { value: "Updated Task" },
    });

    mockedAxios.put.mockResolvedValueOnce({ data: {} });

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
    });
  });

  it("deletes a task", async () => {
    render(<App />);

    await waitFor(() => screen.getByText("Test Task"));

    fireEvent.click(screen.getByText("Delete"));

    mockedAxios.delete.mockResolvedValueOnce({ data: {} });

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    });
  });
});