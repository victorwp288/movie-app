import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { getUserBookmarks } from '../services/MovieService';
import MovieCard from '../components/MovieCard';

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!authTokens?.userId) return;
      
      try {
        const data = await getUserBookmarks(authTokens.userId);
        setBookmarks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [authTokens?.userId]);

  if (!authTokens?.userId) {
    return (
      <Container className="mt-4">
        <div className="alert alert-warning">
          Please log in to view your bookmarks
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>My Bookmarks</h2>
      <Row>
        {bookmarks.map((movie) => (
          <Col key={movie.tconst} xs={12} md={6} lg={4}>
            <MovieCard 
              movie={movie} 
              isBookmarked={true}
              onBookmarkChange={(id, isBookmarked) => {
                if (!isBookmarked) {
                  setBookmarks(prev => prev.filter(m => m.tconst !== id));
                }
              }}
            />
          </Col>
        ))}
      </Row>
      {bookmarks.length === 0 && (
        <div className="text-center mt-4">
          <p>You haven't bookmarked any movies yet</p>
        </div>
      )}
    </Container>
  );
}

export default Bookmarks; 