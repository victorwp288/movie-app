import React, { useState,useContext } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { passwordSchema } from "../services/SecurityService";
import { AuthContext } from '../context/AuthContext';


const PasswordModal = ({ isOpen, onClose, onSubmit, userDet }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const { authTokens} = useContext(AuthContext);

    const resetForm = () => {
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        };

    const handleSubmit = async (e) => {
      setError(''); // Clear any previous error messages
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await passwordSchema.parseAsync(newPassword);
            console.log(`${process.env.REACT_APP_API_URL}/users/${authTokens.userId}/update`);
            console.log(authTokens.accessToken);
            
            const dataToApi = {
                email: userDet.email,
                username: userDet.username,
                password: newPassword,
            };
            console.log(JSON.stringify(dataToApi));
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${authTokens.userId}/update`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToApi)
            });
            console.log('one');
            if (!response.ok) {
                console.log('two');
                const data = await response.json();
                throw new Error(data.message || 'Registration failed');
            }
    
            setShowSuccessAlert(true) 
            setTimeout(() => {
                setShowSuccessAlert(false);
                onSubmit(newPassword);
                onClose();
            }, 2000);
            
            setNewPassword('');
            setConfirmPassword('');

        } catch (err) {
            setError(err.message || 'Password update failed. Please try again.'); // Set more meaningful error message
        }
    };
    const handleClose = () => {
        resetForm();
        onClose(); // Call the onClose prop after resetting the form
      };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formNewPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                         {error && <p className="text-danger">{error}</p>}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
};



export default PasswordModal;