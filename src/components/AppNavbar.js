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
    <Navbar expand="lg" className="navbar-dark bg-black">
      <Container>
        <Link className="navbar-brand" to="/" style={{ color: '#F5C518', fontWeight: 'bold' }}>
          IMDb
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <InputGroup className="mx-auto" style={{ maxWidth: '600px' }}>
            <Form onSubmit={handleSearch} className="d-flex w-100">
              <DropdownButton 
                title={searchType} 
                id="input-group-dropdown-1" 
                variant="secondary"
                style={{
                  backgroundColor: '#2a2a2a',
                  borderRadius: '4px 0 0 4px'
                }}
              >
                <Dropdown.Item onClick={() => setSearchType("All")}>All</Dropdown.Item>
                <Dropdown.Item onClick={() => setSearchType("Titles")}>Titles</Dropdown.Item>
                <Dropdown.Item onClick={() => setSearchType("Persons")}>Persons</Dropdown.Item>
                <Dropdown.Item onClick={() => setSearchType("Database")}>Database</Dropdown.Item>
              </DropdownButton>
              <Form.Control
                type="search"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search movies"
                style={{
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #404040',
                  color: 'white',
                  width: '100%'
                }}
              />
              <Button 
                variant="outline-warning" 
                type="submit"
                style={{
                  borderColor: '#F5C518',
                  color: '#F5C518',
                  marginLeft: '-1px',
                  borderRadius: '0 4px 4px 0'
                }}
              >
                Search
              </Button>
            </Form>
          </InputGroup>
          <Nav className="ms-auto">
            {authTokens ? (
              <>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Sign In</Nav.Link>
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
