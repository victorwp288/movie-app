import React, { useContext, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

function AppNavbar() {
  const { authTokens, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black">
      <Container>
        <Link className="navbar-brand" to="/" style={{ color: '#F5C518', fontWeight: 'bold' }}>
          IMDb
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <Form className="d-flex mx-auto" onSubmit={handleSearch}>
            <div className="input-group">
              <Form.Control
                type="search"
                placeholder="Search IMDb"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
              <Button 
                variant="outline-warning" 
                type="submit"
              >
                Search
              </Button>
            </div>
          </Form>
          
          <ul className="navbar-nav ms-auto">
            {authTokens ? (
              <NavDropdown 
                title={<i className="fas fa-user"></i>} 
                id="basic-nav-dropdown" 
                align="end"
                className="nav-link"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Sign In</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/watchlist">Watchlist</Link>
            </li>
          </ul>
        </div>
      </Container>
    </nav>
  );
}

export default AppNavbar;
