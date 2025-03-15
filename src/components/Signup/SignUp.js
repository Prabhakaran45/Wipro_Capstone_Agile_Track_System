import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = (values) => {
    const signUpDetails = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: 'employee',
    };

    axios.post('http://localhost:5000/users', signUpDetails)
      .then((response) => {
        console.log(response);
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-left mb-4">Sign Up</h2>
      <div className="row justify-content-left">
        <div className="col-md-6">
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: ''
            }}
            onSubmit={(values) => {
              handleSignUp(values);
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Name Required'),
              email: Yup.string().email("Please include an '@'").required('Required'),
              password: Yup.string()
                .required('password Required')
                .min(8, 'Password is too short - should be 8 chars minimum'),
            })}
          >
            {(formik) => {
              return (
                <Form id="signUpForm">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={!(formik.isValid && formik.dirty)}
                  >
                    Sign Up
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
