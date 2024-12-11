import React, { useContext, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';

function AppNavbar() {
  const { authTokens, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");

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
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
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
          <Nav>
            {authTokens ? (
              <NavDropdown 
                title={<i className="fas fa-user"></i>} 
                id="basic-nav-dropdown" 
                align="end"
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
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
