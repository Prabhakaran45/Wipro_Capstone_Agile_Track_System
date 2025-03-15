import React, { useContext } from 'react';
import { font } from '../Style/Style';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Nav = () => {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate('/login');
    };
   
  
    return (
      <>
      <h1 className="display-4 text-center text-secondary" style={font}>Agile Track System</h1>
      <br/>
  
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav flex-column">
              <li className="nav-item">
                <Link className="nav-link text-primary" to="/">Dashboard</Link>
              </li>
              {user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-success" to="/profiles">Profiles</Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-danger " onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link  text-primary" to="/login">Login</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      </>
    );
  };

  export default Nav;