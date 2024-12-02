import React, { useState, useContext } from "react";
import { login } from "../services/AuthService";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { passwordSchema } from "../services/SecurityService";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setAuthTokens } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value.trim()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await passwordSchema.parseAsync(formData.password);
      
      const response = await login(formData.username, formData.password);
      setAuthTokens(response);
      navigate('/', { replace: true });
    } catch (err) {
      if(err.name === 'ZodError') {
        setError(err.errors[0].message);
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username (not email)"
          />
          <Form.Text className="text-muted">
            Please use your username, not email address
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
            autoComplete="current-password"
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button 
            variant="primary" 
            type="submit"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </Form>

      <p className="text-center mt-3">
        Don't have an account?{' '}
        <Button 
          variant="link" 
          onClick={() => navigate('/signup')}
          className="p-0"
        >
          Sign Up
        </Button>
      </p>
    </Container>
  );
}

export default Login;
