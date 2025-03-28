import React, { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
}

// Functional component
const App: React.FC = () => {
  
  //Hooks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to get tasks
  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:3000/api/tasks");
    setTasks(response.data);
  };

  // Function to add task
  const addTask = async () => {
    if (!title) {
      alert("Task Title is required.");
      return;
    }

    await axios.post("http://localhost:3000/api/createtask", {
      title,
      description: description || "",
      dueDate: dueDate || null,
    });

    fetchTasks();
    resetForm();
  };

  // Function to update task
  const updateTask = async () => {
    if (!selectedTask) return;
    await axios.put(`http://localhost:3000/api/tasks/${selectedTask.id}`, {
      title,
      description,
      dueDate: dueDate,
    });
    fetchTasks();
    resetForm();
  };

  // Function to delete task
  const deleteTask = async (id: number) => {
    await axios.delete(`http://localhost:3000/api/tasks/${id}`);
    fetchTasks();
  };

  // Function to clear inputs
  const resetForm = () => {
    setSelectedTask(null);
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="col-md-8">
        <h2 className="mb-4 text-center">Task Manager</h2>
        <div className="mb-3">
          <input type="text" className="form-control mb-2" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" className="form-control mb-2" placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="date" className="form-control mb-2" placeholder="YYYY-mm-dd" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <button className="btn btn-success mt-2 me-2" onClick={addTask}>Add</button>
          <button className="btn btn-info mt-2" onClick={updateTask} disabled={!selectedTask}>Update</button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task,index) => (
                <tr key={task.id} onClick={() => { setSelectedTask(task); setTitle(task.title); setDescription(task.description); setDueDate(task.dueDate); }}>
                  <td >{index+1}</td>
                  <td className="wrapText">{task.title}</td>
                  <td className="wrapText">{task.description}</td>
                  <td>{task.dueDate}</td>
                  <td>
                    <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
