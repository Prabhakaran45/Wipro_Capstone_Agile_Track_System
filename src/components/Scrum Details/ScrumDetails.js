import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const ScrumDetails = ({ scrum }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
      if (!loggedInUser) {
        navigate('/login');
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    const fetchTasks = () => {
      axios
        .get(`http://localhost:5000/tasks?scrumId=${scrum.id}`)
        .then((response) => {
          setTasks(response.data);
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
        });
    };
    fetchTasks();
  }, [scrum.id]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/users')
      .then((response) => {
        const scrumUsers = response.data.filter((user) =>
          tasks.some((task) => task.assignedTo === user.id)
        );
        setUsers(scrumUsers);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, [tasks]);

  const handleStatusChange = (taskId, newStatus) => {
    const payload = {
      status: newStatus,
      history: [
        ...tasks.find((task) => task.id === taskId).history,
        {
          status: newStatus,
          date: new Date().toISOString().split('T')[0],
        },
      ],
    };
    axios
      .patch(`http://localhost:5000/tasks/${taskId}`, payload)
      .then((response) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, ...payload } : task
          )
        );
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  };

  return (
    <div className="container mt-4">
  <div className="row justify-content-left">
    <div className="col-md-8">
      <h3 className="mb-3 text-left">Scrum Details for {scrum.name}</h3>
      <div className="mt-4">
        <h4 className="text-left">Tasks</h4>
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{task.title}:</strong> {task.description} - <em>{task.status}</em>
              </div>
              {user?.role === 'admin' && (
                <select
                  className="form-select w-auto ms-3"
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="To Do">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Completed</option>
                </select>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h4 className="text-left">Users</h4>
        <ul className="list-group">
          {users.map((user) => (
            <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>{user.name} ({user.email})</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</div>

  );
};

export default ScrumDetails;