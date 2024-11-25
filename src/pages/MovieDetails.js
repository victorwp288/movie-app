import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, addBookmark, rateMovie, getUserBookmarks, removeBookmark } from "../services/MovieService";
import { Container, Button, Card, Row, Col, Badge, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { FaStar, FaRegStar, FaBookmark } from 'react-icons/fa';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authTokens } = useContext(AuthContext);
  const userId = authTokens ? authTokens.userId : null;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const cleanId = id.trim();
        console.log('Fetching movie details for ID:', cleanId);
        const data = await getMovieDetails(cleanId);
        console.log('Movie details:', data);
        setMovie(data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(err.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (userId && movie?.tConst) {
        try {
          const bookmarks = await getUserBookmarks(userId);
          const isMovieBookmarked = bookmarks.some(b => b.tConst === movie.tConst);
          setIsBookmarked(isMovieBookmarked);
        } catch (error) {
          console.error('Error checking bookmark status:', error);
        }
      }
    };

    checkBookmarkStatus();
  }, [userId, movie]);

  const handleBookmark = async () => {
    if (!userId) {
      alert("Please log in to bookmark movies.");
      return;
    }

    const movieId = movie?.tConst;
    if (!movieId) {
      console.error('No movie ID available:', movie);
      alert('Cannot bookmark this movie');
      return;
    }

    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(userId, movieId);
      } else {
        await addBookmark(userId, movieId);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error updating bookmark:', error);
      alert('Failed to update bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleRating = async (newRating) => {
    if (userId) {
      try {
        await rateMovie(userId, movie.tConst, newRating);
        setRating(newRating);
        alert("Rating submitted successfully!");
      } catch (error) {
        alert("Failed to submit rating");
      }
    } else {
      alert("Please log in to rate movies.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container className="mt-4">
        <div className="alert alert-warning" role="alert">
          Movie not found
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Row>
            <Col md={8}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h1>{movie.primaryTitle}</h1>
                  {movie.originalTitle !== movie.primaryTitle && (
                    <h5 className="text-muted">Original Title: {movie.originalTitle}</h5>
                  )}
                </div>
                {userId && (
                  <Button 
                    variant={isBookmarked ? "warning" : "outline-warning"}
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                  >
                    <FaBookmark /> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </Button>
                )}
              </div>

              <div className="mt-3">
                <Badge bg="secondary" className="me-2">
                  {movie.startYear}{movie.endYear && ` - ${movie.endYear}`}
                </Badge>
                <Badge bg="secondary" className="me-2">
                  {movie.runTimeMinutes} min
                </Badge>
                {movie.isAdult && (
                  <Badge bg="danger" className="me-2">
                    18+
                  </Badge>
                )}
              </div>

              <div className="mt-4">
                <h5>Average Rating: {movie.averageRating}/5 ({movie.numVotes} votes)</h5>
                {userId && (
                  <div className="mt-3">
                    <h6>Your Rating:</h6>
                    <div className="d-flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <Button
                          key={num}
                          variant={num <= rating ? "warning" : "outline-warning"}
                          onClick={() => handleRating(num)}
                        >
                          {num <= rating ? <FaStar /> : <FaRegStar />}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="mt-4">
                  <h5>Genres:</h5>
                  <div>
                    {movie.genres.map((genre, index) => (
                      <Badge 
                        key={index} 
                        bg="primary" 
                        className="me-2"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h5>Additional Information:</h5>
                <p><strong>IMDB ID:</strong> {movie.tConst}</p>
                {movie.url && (
                  <p>
                    <strong>More Info:</strong>{' '}
                    <a href={movie.url} target="_blank" rel="noopener noreferrer">
                      View on IMDB
                    </a>
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default MovieDetails;
