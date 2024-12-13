import React, { useContext, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';


function AppNavbar() {
  const { authTokens, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("All");

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}&type=${encodeURIComponent(searchType)}`);
      //setSearchTerm("");
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
          <Navbar.Brand as={Link} to="/">Movie App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
            </Nav>
            <row>
              <InputGroup className="mb-3">
                <Form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}> {/* Add flexbox styles */}
                  <DropdownButton title={searchType} id="input-group-dropdown-1" style={{ marginRight: '10px' }}> {/* Added margin for spacing */}
                    <Dropdown.Item onClick={() => setSearchType("All")}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSearchType("Titles")}>Titles</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSearchType("Persons")}>Persons</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSearchType("Database")}>Database</Dropdown.Item>
                  </DropdownButton>
                  <Form.Control
                    type="search"
                    placeholder="Search movies..."
                    className="me-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search movies"
                    style={{ flexGrow: 1 }} // This allows the search bar to take up available space
                  />
                  <Button variant="outline-light" type="submit" style={{ marginLeft: '10px' }}>Search</Button> {/* Added margin for spacing */}
                </Form>
              </InputGroup>
            </row>
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
          </Navbar.Collapse>
        </div>
      </Container>
    </nav>
  );
}

export default AppNavbar;
