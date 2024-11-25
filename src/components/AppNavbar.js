import React, { useContext, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Movie App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav>
          
          <Form 
            className="d-flex mx-auto" 
            onSubmit={handleSearch}
            style={{ minWidth: '300px' }}
          >
            <Form.Control
              type="search"
              placeholder="Search movies..."
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-light" type="submit">Search</Button>
          </Form>

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
