import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [input, setinput] = useState('');
  const [tasks, settasks] = useState([]);
  const [isediting, setisediting] = useState(false);
  const [editid, seteditid] = useState(null);
  const [filter, setFilter] = useState('pending'); // "pending" or "completed"

  const api = 'http://localhost:3000/tasks';

  // Load tasks from backend
  useEffect(() => {
    axios.get(api).then(res => settasks(res.data)).catch(err => console.error(err));
  }, []);

  // Add or Update task
  const addtask = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (isediting) {
      await axios.put(`${api}/${editid}`, { text: trimmed });
      setisediting(false);
      seteditid(null);
    } else {
      await axios.post(api, { text: trimmed, completed: false });
    }

    const res = await axios.get(api);
    settasks(res.data);
    setinput('');
  };

  // Start editing
  const startEditing = (task) => {
    setisediting(true);
    seteditid(task._id);
    setinput(task.text);
  };

  // Toggle complete when checkbox clicked
  const toggletask = async (task) => {
    await axios.put(`${api}/${task._id}`, { ...task, completed: !task.completed });
    const res = await axios.get(api);
    settasks(res.data);
  };

  // Delete task
  const deletetask = async (id) => {
    await axios.delete(`${api}/${id}`);
    const res = await axios.get(api);
    settasks(res.data);
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task =>
    filter === 'pending' ? !task.completed : task.completed
  );

  return (
    <div className="container">
      <h1 className="logo-text">Todo List</h1>

      <div className="input-block">
        <input
          type="text"
          value={input}
          onChange={(e) => setinput(e.target.value)}
          placeholder="Enter a task"
        />
        <button className="add-btn" onClick={addtask}>
          {isediting ? 'Update' : 'Add'}
        </button>
      </div>

      {/* Filter buttons */}
      <div className="filter-buttons" style={{ marginBottom: '15px' }}>
        <button
          onClick={() => setFilter('pending')}
          style={{
            backgroundColor: filter === 'pending' ? '#0d6efd' : '#e0e0e0',
            color: filter === 'pending' ? 'white' : 'black',
            marginRight: '10px',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Pending
        </button>

        <button
          onClick={() => setFilter('completed')}
          style={{
            backgroundColor: filter === 'completed' ? '#0d6efd' : '#e0e0e0',
            color: filter === 'completed' ? 'white' : 'black',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Completed
        </button>
      </div>

      {/* Task list */}
      <ul className="tasks-list">
        {filteredTasks.length === 0 ? (
          <p>No {filter} tasks</p>
        ) : (
          filteredTasks.map(task => (
            <li key={task._id} className="task-item" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggletask(task)}
                style={{ marginRight: '10px' }}
              />
              <span style={{ flexGrow: 1, textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
              </span>
              <div className="op-btn">
                <button className="delete" onClick={() => deletetask(task._id)}>Delete</button>
                <button onClick={() => startEditing(task)}>Edit</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
