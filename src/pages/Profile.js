import React, { useContext, useState, useEffect } from 'react';
import { Container, Card, ListGroup, Button, Row, Col, Spinner, Badge, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserBookmarks, getUserRatingsWithMovies } from '../services/MovieService';
import MovieCard from '../components/MovieCard';
import { FaStar } from 'react-icons/fa';
import PasswordModal from '../components/PasswordModal';
import { removeUser } from '../services/MovieService';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';


function Profile() {
  const { authTokens, logout } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const navigate = useNavigate();
  const [showAlertPasCh, setShowAlertPasCh] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${authTokens.userId}`,
          {
            headers: {
              'Authorization': `Bearer ${authTokens.token}`
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchBookmarks = async () => {
      if (!authTokens?.userId) return;
      
      try {
        const bookmarkedMovies = await getUserBookmarks(authTokens.userId);
        setBookmarks(bookmarkedMovies);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };

    const fetchRatings = async () => {
      if (!authTokens?.userId) return;
      
      try {
        setRatingsLoading(true);
        const userRatings = await getUserRatingsWithMovies(authTokens.userId);
        setRatings(userRatings);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setRatingsLoading(false);
      }
    };

    fetchUserDetails();
    fetchBookmarks();
    fetchRatings();
  }, [authTokens]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const [showModal, setShowModal] = useState(false);
      
  const handlePasswordChange = (newPassword) => {
      console.log('New Password:', newPassword);
      // Here, you would typically send the new password to an API endpoint.
      // For this example, we'll simulate a successful password change and show the alert
      setShowAlertPasCh(true);

      // After 3 seconds, hide the alert
      setTimeout(() => {
          setShowAlertPasCh(false);
      }, 3000);
  };

  const handleChangePassword = () => {
      setShowModal(true);
  };
  

  const handleDeleteUser = async () => {
    setShowDeleteModal(true);
};

const handleConfirmDelete = async () => {
try {
  await removeUser(authTokens.userId);
  logout();
  navigate('/', { replace: true });
  setShowDeleteModal(false);
} catch (error) {
    console.error('Error deleting user:', error);
      setShowDeleteModal(false);
}
};

const handleCancelDelete = () => {
setShowDeleteModal(false);
};

  const handleBookmarkRemove = async (movieId) => {
    setBookmarks(prev => prev.filter(movie => movie.tconst !== movieId));
  };

  const fetchBookmarks = async () => {
    if (!authTokens?.userId) return;
    
    try {
      const bookmarkedMovies = await getUserBookmarks(authTokens.userId);
      setBookmarks(bookmarkedMovies);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  // Add focus effect to refresh bookmarks
  useEffect(() => {
    const handleFocus = () => {
      fetchBookmarks();
    };

    window.addEventListener('focus', handleFocus);
    // Also refresh when component mounts
    fetchBookmarks();

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [authTokens]);

  return (
    <Container className="mt-4">
      {/* User Profile Card */}
      <Card style={{ maxWidth: '600px' }} className="mx-auto mb-4">
        <Card.Header as="h4">Profile</Card.Header>
        {userDetails ? (
          <>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Username:</strong> {userDetails.username}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email:</strong> {userDetails.email}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between align-items-center">
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              
                {showAlertPasCh && (
                  <Alert variant="success" onClose={() => setShowAlertPasCh(false)} dismissible>
                      Password successfully changed!
                  </Alert>
                )}
                <Button variant="warning" onClick={handleChangePassword}>
                  Change Password
                </Button>
                <PasswordModal
                  isOpen={showModal}
                  onClose={() => setShowModal(false)}
                  onSubmit={handlePasswordChange}
                  userDet={userDetails}
                />
              
                <Button variant="danger" onClick={handleDeleteUser}>
                  Remove Account
                </Button>
                <DeleteConfirmationModal
                  isOpen={showDeleteModal}
                  onClose={handleCancelDelete}
                  onConfirm={handleConfirmDelete}
                />
              </div>
            </Card.Footer>
          </>
        ) : (
          <Card.Body>Loading...</Card.Body>
        )}
      </Card>

      {/* Ratings Section */}
      <Card className="mt-4">
        <Card.Header as="h4">My Ratings</Card.Header>
        <Card.Body>
          {ratingsLoading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : ratings.length === 0 ? (
            <p className="text-center">You haven't rated any movies yet.</p>
          ) : (
            <Row>
              {ratings.map((rating) => (
                <Col key={rating.tConst} xs={12} md={6} lg={4}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>
                        <a href={`/movie/${rating.tConst}`} className="text-decoration-none text-dark">
                          {rating.movieTitle}
                        </a>
                      </Card.Title>
                      <div className="d-flex align-items-center mb-2">
                        <div className="me-2">
                          {Array.from({ length: 10 }).map((_, index) => (
                            <FaStar
                              key={index}
                              size={12}
                              color={index < rating.rating ? "#ffc107" : "#e4e5e9"}
                            />
                          ))}
                        </div>
                        <Badge bg="secondary">{rating.rating}/10</Badge>
                      </div>
                      {rating.review && (
                        <Card.Text className="text-muted">
                          "{rating.review}"
                        </Card.Text>
                      )}
                      <small className="text-muted">
                        Rated on: {new Date(rating.reviewDate).toLocaleDateString()}
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Bookmarks Section */}
      <Card className="mt-4">
        <Card.Header as="h4">My Bookmarks</Card.Header>
        <Card.Body>
          {bookmarks.length === 0 ? (
            <p className="text-center">You haven't bookmarked any movies yet.</p>
          ) : (
            <Row>
              {bookmarks.map((movie) => (
                <Col key={movie.tconst} xs={12} md={6} lg={4}>
                  <MovieCard 
                    movie={movie}
                    isBookmarked={true}
                    onBookmarkChange={(id, isBookmarked) => {
                      if (!isBookmarked) {
                        handleBookmarkRemove(id);
                      }
                    }}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile; 