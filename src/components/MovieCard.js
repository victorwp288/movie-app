import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { AuthContext } from "../context/AuthContext";
import { addBookmark, removeBookmark } from "../services/MovieService";

function MovieCard({ movie, isBookmarked = false, onBookmarkChange }) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);
  const { authTokens } = useContext(AuthContext);
  
  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!authTokens?.userId) {
      alert('Please log in to bookmark movies');
      return;
    }

    const movieId = movie?.tConst || movie?.tconst || movie?.id;
    if (!movieId) {
      console.error('No movie ID available:', movie);
      alert('Cannot bookmark this movie');
      return;
    }

    setLoading(true);
    try {
      if (bookmarked) {
        await removeBookmark(authTokens.userId, movieId.trim());
      } else {
        await addBookmark(authTokens.userId, movieId.trim());
      }
      setBookmarked(!bookmarked);
      if (onBookmarkChange) onBookmarkChange(movieId.trim(), !bookmarked);
    } catch (error) {
      console.error('Bookmark error:', error);
      alert('Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  const BookmarkIcon = bookmarked ? FaBookmark : FaRegBookmark;
  const bookmarkStyle = {
    color: bookmarked ? '#ffc107' : '#6c757d',
    cursor: 'pointer'
  };

  const id = (movie?.tConst || movie?.tconst || movie?.id || '').trim();
  const title = movie?.primaryTitle || movie?.originalTitle || movie?.name || 'Untitled';
  const type = movie?.titleType || movie?.type || 'Unknown';

  if (!id) {
    console.warn('Movie card received invalid data:', movie);
    return null;
  }

  return (
    <Link to={`/movie/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card className="h-100 mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between">
            <Card.Title>{title}</Card.Title>
            {authTokens?.userId && (
              <Button
                variant="link"
                onClick={handleBookmark}
                disabled={loading}
                className="p-0"
                style={bookmarkStyle}
              >
                <BookmarkIcon size={20} />
              </Button>
            )}
          </div>
          <Card.Text>
            <span className="badge bg-secondary me-2">{type}</span>
            <small className="text-muted">{id}</small>
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default MovieCard;
