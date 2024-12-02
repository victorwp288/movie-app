import React, { useContext, useState, useEffect } from 'react';
import { Container, Card, ListGroup, Button, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserBookmarks, getUserRatingsWithMovies } from '../services/MovieService';
import MovieCard from '../components/MovieCard';
import { FaStar } from 'react-icons/fa';

function Profile() {
  const { authTokens, logout } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const navigate = useNavigate();

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
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
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