import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import ScrumDetails from '../Scrum Details/ScrumDetails';


const Dashboard = () => {

    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        axios.get("http://localhost:5000/scrums")
             .then(res => setScrums(res.data))
             .catch(err => console.log(err));

        axios.get("http://localhost:5000/users")
             .then(res => setUsers(res.data))
             .catch(err => console.log(err));

    }, []);

    const handleGetDetails = (scrumId) => {
        axios.get(`http://localhost:5000/scrums/${scrumId}`)
             .then(res => setSelectedScrum(res.data))
             .catch(err => console.log(err));
    }
    const handleAddScrum = (values) => {

        let existingScrum = scrums.find(scrum => scrum.name === values.name);

        if (existingScrum) {
            const taskPayload = {
                title: values.title,
                description: values.description,
                assignedTo: values.assignedTo,
                status: values.status,
                scrumId: existingScrum.id,
                history: [{
                    status: values.status,
                    date: new Date().toISOString().split("T")[0],
                }],
            };
            axios.post("http://localhost:5000/tasks", taskPayload)
                .then(() => setShowForm(false))
                .catch(err => console.log(err));

        } else {
            const scrumPayload = {
                name: values.name,
            };

            axios.post("http://localhost:5000/scrums", scrumPayload)
                .then(res => {
                    const newScrum = res.data;

                    const taskPayload = {
                        title: values.title,
                        description: values.description,
                        assignedTo: values.assignedTo,
                        status: values.status,
                        scrumId: newScrum.id,
                        history: [{
                            status: values.status,
                            date: new Date().toISOString().split("T")[0],
                        }],
                    };

                    return axios.post("http://localhost:5000/tasks", taskPayload);
                })
                .then(() => axios.get("http://localhost:5000/scrums"))
                .then(res => {
                    setScrums(res.data);
                    setShowForm(false);
                })
                .catch(err => console.log(err));
        }


    };

    return (

        <div>
            <br></br>
            <h2 className='text-secondary'>Scrum Teams</h2>
            {user?.role === 'admin' && (
                <div>
                    <button
                        className={showForm ? 'btn btn-danger' : 'btn btn-primary'}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : 'Add New Scrum'}
                    </button>


                    {showForm && (
                
                <Formik
                initialValues={{
                  name: '',
                  title: '',
                  description: '',
                  assignedTo: '',
                  status: 'To Do',
                }}
                validationSchema={Yup.object({
                  name: Yup.string().required(' Name is Required'),
                  title: Yup.string().required('Title is Required'),
                  description: Yup.string().required(' Description is Required'),
                  assignedTo: Yup.string().required('Required '),
                })}
                onSubmit={(values, { resetForm }) => {
                  handleAddScrum(values);
                  resetForm();
                }}
              >
                {(formik) => (
                  <div className="container mt-4">
                    <div className="row justify-content-left">
                      <div className="col-md-6">
                        <Form id="addScrumForm" className="needs-validation">
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">Scrum Name</label>
                            <Field name="name" type="text" id="name" className="form-control" />
                            <ErrorMessage name="name" component="div" className="text-danger" />
                          </div>
              
                          <div className="mb-3">
                            <label htmlFor="title" className="form-label">Task Title</label>
                            <Field name="title" type="text" id="title" className="form-control" />
                            <ErrorMessage name="title" component="div" className="text-danger" />
                          </div>
              
                          <div className="mb-3">
                            <label htmlFor="description" className="form-label">Task Description</label>
                            <Field name="description" type="text" id="description" className="form-control" />
                            <ErrorMessage name="description" component="div" className="text-danger" />
                          </div>
              
                          <div className="mb-3">
                            <label htmlFor="status" className="form-label">Task Status</label>
                            <Field name="status" as="select" id="status" className="form-select">
                              <option value="To Do">To Do</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Done">Done</option>
                            </Field>
                            <ErrorMessage name="status" component="div" className="text-danger" />
                          </div>
              
                          <div className="mb-3">
                            <label htmlFor="assignedTo" className="form-label">Assigned To</label>
                            <Field name="assignedTo" as="select" id="assignedTo" className="form-select">
                              <option value="">Select a user</option>
                              {users.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                              ))}
                            </Field>
                            <ErrorMessage name="assignedTo" component="div" className="text-danger" />
                          </div>
              
                          <button type="submit" className="btn btn-success" disabled={!(formik.isValid && formik.dirty)}>
                            Create Scrum
                          </button>
                        </Form>
                      </div>
                    </div>
                  </div>
                )}
              </Formik>
              
                      
                    )}
                </div>
            )}
            <div className="container mt-5">
                <div className="row justify-content-left">
                    <div className="col-md-6">
                        <ul className="list-group">
                            {scrums.map((scrum) => (
                                <li key={scrum.id} className="list-group-item d-flex justify-content-between align-items-left">
                                    <span className="text-truncate" style={{ maxWidth: '150px' }}>{scrum.name}</span>
                                    <button className="btn btn-info btn-sm" onClick={() => handleGetDetails(scrum.id)}>Get Details</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </div>
    );
};

export default Dashboard;
