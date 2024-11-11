import React, { useState, useEffect } from "react";
import Tasks from "./components/Tasks";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [catImage, setCatImage] = useState<string | null>(null);

  useEffect(() => {
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: Date.now(),
        text: newTask,
        completed: false,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
    }
  };

  const toggleCompletion = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: number) =>
    setTasks(tasks.filter((task) => task.id !== taskId));

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTask();
  };

  const fetchCatImage = async () => {
    try {
      const response = await fetch(
        "https://api.thecatapi.com/v1/images/search"
      );
      const data = await response.json();
      setCatImage(data[0].url);
    } catch (error) {
      console.error("Error fetching cat image:", error);
    }
  };

  const getRandomPlaceholder = () => {
    const placeholders = [
      "Add something to avoid...",
      "What are we putting off today?",
      "Enter another task to ignore",
      "Type your future regrets here",
      "Add to your guilt list...",
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  return (
    <div className="app-container">
      <button
        className="theme-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      <h1>Stuff That’ll Get Done Someday</h1>

      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={getRandomPlaceholder()}
        />
        <button onClick={addTask} aria-label="Add a new task">
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-state">
          No tasks yet. Guess we’re taking a break...
        </p>
      ) : (
        <ul className="tasks-container">
          {tasks.map((task) => (
            <li key={task.id}>
              <Tasks
                task={task}
                toggleCompletion={toggleCompletion}
                deleteTask={deleteTask}
              />
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={fetchCatImage}
        className="cat-button"
        aria-label="Fetch a random cat image"
      >
        Cat time
      </button>
      {catImage && <img src={catImage} alt="A random cat" />}
    </div>
  );
};

export default App;
