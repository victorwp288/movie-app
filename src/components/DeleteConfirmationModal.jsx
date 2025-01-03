import React from 'react';
import { Modal, Button } from 'react-bootstrap';


const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    return (
      <Modal show={isOpen} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete your account? (You will lose all your Bookmarks and Ratings)
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            No
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  export default DeleteConfirmationModal;