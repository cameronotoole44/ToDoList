import React from "react";

interface TaskProps {
  task: {
    id: number;
    text: string;
    completed: boolean;
  };
  toggleCompletion: (id: number) => void;
  deleteTask: (id: number) => void;
}

const Tasks: React.FC<TaskProps> = ({ task, toggleCompletion, deleteTask }) => {
  return (
    <li className={`quest-item ${task.completed ? "completed" : ""}`}>
      <label>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleCompletion(task.id)}
          id={`task-checkbox-${task.id}`}
          aria-labelledby={`task-label-${task.id}`}
        />
        <span id={`task-label-${task.id}`}>{task.text}</span>
      </label>
      <button onClick={() => deleteTask(task.id)} aria-label="Delete task">
        Delete
      </button>
    </li>
  );
};

export default Tasks;
