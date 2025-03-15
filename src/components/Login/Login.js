import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { Field, Formik, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('user')) {
            navigate('/profiles');
        }
    }, [navigate]);

    const handleLogin = (values) => {
        const { email, password } = values;
        axios
            .get(`http://localhost:5000/users?email=${email}&password=${password}`)
            .then((response) => {
                if (response.data.length > 0) {
                    const user = response.data[0];
                    login(user);
                    if (user.role === 'admin') {
                        navigate('/');
                    } else {
                        navigate('/profiles');
                    }
                } else {
                    alert('Invalid email or password');
                }
            })
            .catch((error) => {
                console.error('Error logging in:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-left mb-4">Login</h2>
            <div className="row">

                <div className="col-6">
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={(values, { resetForm }) => {
                            handleLogin(values);
                            resetForm();
                        }}
                        validationSchema={Yup.object()
                            .shape({
                            email: Yup.string().email("Please include an '@'").required('Email is required'),
                            password: Yup.string().required('Password is required'),
                        })}
                    >
                        {(formik) => {
                            return (
                                <Form id="loginForm">
                                    <div className="mb-3">
                                        <label className="form-label w-50">
                                            Email:
                                            <Field
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                required
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </label>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label w-50">
                                            Password:
                                            <Field
                                                type="password"
                                                name="password"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                required
                                            />
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </label>
                                    </div>
                                    <div className="mb-3 ">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-25  me-2"
                                            disabled={!(formik.isValid && formik.dirty)}
                                        >
                                            Login
                                        </button>
                                        <button
                                            className="btn btn-secondary  w-25 "
                                            onClick={() => navigate('/signup')}
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>


                <div className="col-6"></div>
            </div>
        </div>

    );
};

export default Login;
