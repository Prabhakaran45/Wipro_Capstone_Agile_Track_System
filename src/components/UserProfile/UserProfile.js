import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            axios.get('http://localhost:5000/users')
                .then(res => {
                    if (user.role === 'admin') {
                        setUsers(res.data.filter(u => u?.role !== 'admin'));
                    } else {
                        setSelectedUser(user);
                    }
                })
                .catch(err => console.log(err));
        }
    }, [user]);

    useEffect(() => {
        if (user?.id) {
            fetchTasks(user.id);
        }
    }, [user]);

    const fetchTasks = (userId) => {
        axios.get(`http://localhost:5000/tasks?assignedTo=${userId}`)
            .then(res => setTasks(res.data))
            .catch(err => console.log('Error fetching tasks:', err));
    };

    const handleGetHistory = (userId) => {
        fetchTasks(userId);
        setSelectedUser(users.find(u => u?.id === userId));
    };

    const handleAddUser = (values) => {
        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role
        };
        axios.post('http://localhost:5000/users', payload)
            .then(() => axios.get('http://localhost:5000/users'))
            .then(res => {
                setUsers(res.data.filter(u => u?.role !== 'admin'));
                setShowForm(false);
            })
            .catch(err => console.log('Error adding user:', err));
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">User Profiles</h2>
            {user?.role === 'admin' && (
                <div>
                    <button className={showForm ? "btn btn-danger mb-3 mt-3" :"btn btn-primary mb-3 mt-3"} onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : 'Add New User'}
                    </button>
                    {showForm && (
                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                password: '',
                                role: 'employee'
                            }}
                            onSubmit={(values, { resetForm }) => {
                                handleAddUser(values);
                                resetForm();
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string().required('Name is Required'),
                                email: Yup.string().email('Invalid email format').required('Required'),
                                password: Yup.string().required('password is Required'),
                                role: Yup.string().required('role is Required')
                            })}
                        >
                            {formik => (
                                <Form id='addUserForm' className="card p-3 mb-3">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <Field type="text" id="name" name="name" className="form-control" />
                                        <ErrorMessage name="name" component="div" className='text-danger' />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <Field type="email" id="email" name="email" className="form-control" />
                                        <ErrorMessage name="email" component="div" className='text-danger' />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <Field type="password" id="password" name="password" className="form-control" />
                                        <ErrorMessage name="password" component="div" className='text-danger' />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <Field as="select" id="role" name="role" className="form-select">
                                            <option value="employee">Employee</option>
                                            <option value="admin">Admin</option>
                                        </Field>
                                        <ErrorMessage name="role" component="div" className='text-danger' />
                                    </div>
                                    
                                    <button type="submit" className="btn btn-success" disabled={!(formik.isValid && formik.dirty)}>
                                        Create User
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    )}

                    <ul className="list-group">
                        {users.map(user => (
                            <li key={user?.id} className="list-group-item">
                                <strong>Name:</strong> {user?.name}<br />
                                <strong>Email:</strong> {user?.email}<br />
                                <button className="btn btn-info mt-2" onClick={() => handleGetHistory(user?.id)}>Get History</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedUser && (
                <div className="mt-4">
                    <h3>Tasks Worked By {selectedUser.name}</h3>
                    <ul className="list-group">
                        {tasks.map(task => (
                            <li key={task.id} className="list-group-item">
                                <strong>Title:</strong> {task.title}<br />
                                <strong>Description:</strong> {task.description}<br />
                                <strong>Status:</strong> {task.status}<br />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
