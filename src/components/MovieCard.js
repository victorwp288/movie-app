import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { AuthContext } from "../context/AuthContext";
import { addBookmark, removeBookmark, getUserBookmarks } from "../services/MovieService";
import {getImage} from "../services/TMDBService";
import { set } from "zod";

function MovieCard({ movie, isBookmarked = false, onBookmarkChange }) {
  console.log('MovieCard component rendered with movie:', movie);
  console.log('onBookmarkChange:', onBookmarkChange);
  
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  //const [imageURL, setImageURL] = useState("../img/No_Image_Available.jpg");
  const [loading, setLoading] = useState(false);
  const { authTokens } = useContext(AuthContext);
  
  const userId = authTokens ? authTokens.userId : null;
  const movieId = movie.type !== 'Person' ? (movie?.tConst || movie?.tconst || movie?.id || '') : '';
  
  console.log('User ID:', userId);
  console.log('Movie Id:', movieId);
  console.log('Movie:', movie);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (userId && movieId) {
        console.log('Checking bookmark status for movie:', movie.tconst);
        try {
          const bookmarks = await getUserBookmarks(userId);
          console.log('Bookmarks:', bookmarks);
          const isBookmarked = bookmarks.some(b => b.tConst === movieId);
          console.log('Bookmarked:', isBookmarked);
          setBookmarked(isBookmarked);
        } catch (error) {
          console.error('Error checking bookmark status:', error);
        }
      }
    };

    checkBookmarkStatus();
  }, [userId, movie]);

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
  console.log('ID:', id);
  const noImage = "../img/No_Image_Available.jpg";
  const [imageUrl, setImageUrl] = useState(noImage); 
  const [type, setType] = useState('Unknown');

  useEffect(() => {
    const fetchAndSetImage = async () => {
      if (!id) {
        return;
      }
      try {
        const imageData = await getImage(id);
        setImageUrl(imageData.imageUrl || noImage); 
        if (type === 'Unknown' && imageData.type) {
          setType(imageData.type);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchAndSetImage(); 
  }, [id]);

  console.log(imageUrl);
  console.log(type);
  const title = movie?.primaryTitle || movie?.originalTitle || movie?.name  || 'Untitled';

  if (!id) {
    console.warn('Movie card received invalid data:', movie);
    return null;
  }

  return (
    <Link to={`/movie/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card className="h-100 mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between">
            <div className="images-for">
              
                    <img
                      key={id}
                      src={imageUrl}
                      alt="Profile"
                      className="profile-image"
                    />
                  
              
            </div>
            <Card.Title>{title}</Card.Title>
            {authTokens?.userId && movieId && (
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
