import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Link, useNavigate, } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import UserProfile from './components/UserProfile/UserProfile';
import SignUp from './components/Signup/SignUp';


import { UserProvider, UserContext } from '../src/context/UserContext';
import Nav from './components/Nav/Nav';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="container mt-5">
          <Nav />
          <Routes>
            <Route path="/" exact element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profiles" element={<UserProfile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
};



export default App;
