import React, { useContext, useState, useEffect } from 'react';
import { Container, Card, ListGroup, Button, Row, Col, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserBookmarks } from '../services/MovieService';
import MovieCard from '../components/MovieCard';

function Profile() {
  const { authTokens, logout } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const [bookmarksError, setBookmarksError] = useState(null);
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
        setBookmarksLoading(true);
        const bookmarkedMovies = await getUserBookmarks(authTokens.userId);
        setBookmarks(bookmarkedMovies);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setBookmarksLoading(false);
      }
    };

    fetchUserDetails();
    fetchBookmarks();
  }, [authTokens]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleBookmarkRemove = async (movieId) => {
    setBookmarks(prev => prev.filter(movie => movie.tconst !== movieId));
  };

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

      {/* Bookmarks Section */}
      <Card className="mt-4">
        <Card.Header as="h4">My Bookmarks</Card.Header>
        <Card.Body>
          {bookmarksLoading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : bookmarks.length === 0 ? (
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