import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
} from "../services/MovieService";
import { getImage } from "../services/TMDBService";

function MovieCard({ movie, isBookmarked = false, onBookmarkChange }) {
  console.log("MovieCard component rendered with movie:", movie);
  console.log("onBookmarkChange:", onBookmarkChange);

  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);
  const { authTokens } = useContext(AuthContext);

  const userId = authTokens ? authTokens.userId : null;
  const movieId =
    movie.type !== "Person"
      ? movie?.tConst || movie?.tconst || movie?.id || ""
      : "";

  console.log("User ID:", userId);
  console.log("Movie Id:", movieId);
  console.log("Movie:", movie);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (userId && movieId) {
        console.log("Checking bookmark status for movie:", movie.tconst);
        try {
          const bookmarks = await getUserBookmarks(userId);
          console.log("Bookmarks:", bookmarks);
          const isBookmarked = bookmarks.some((b) => b.tConst === movieId);
          console.log("Bookmarked:", isBookmarked);
          setBookmarked(isBookmarked);
        } catch (error) {
          console.error("Error checking bookmark status:", error);
        }
      }
    };

    checkBookmarkStatus();
  }, [userId, movie]);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authTokens?.userId) {
      alert("Please log in to bookmark movies");
      return;
    }

    const movieId = movie?.tConst || movie?.tconst || movie?.id;
    if (!movieId) {
      console.error("No movie ID available:", movie);
      alert("Cannot bookmark this movie");
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
      console.error("Bookmark error:", error);
      alert("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  const BookmarkIcon = bookmarked ? FaBookmark : FaRegBookmark;
  const bookmarkStyle = {
    color: bookmarked ? "#ffc107" : "#6c757d",
    cursor: "pointer",
  };

  const [linkTo, setLinkTo] = useState("movie");

  const id = (movie?.tConst || movie?.tconst || movie?.id || "").trim();
  console.log("ID:", id);
  const noImage = "/assets/missing.jpg";
  const [imageUrl, setImageUrl] = useState(noImage);
  const [overView, setOverView] = useState(movie?.overView || "");
  const [type, setType] = useState(movie?.type || "Unknown");

  if (type === "Person") {
    setType("person");
  }

  useEffect(() => {
    const fetchAndSetImage = async () => {
      if (!id) {
        setImageUrl(noImage);
        return;
      }
      try {
        const imageData = await getImage(id);
        setImageUrl(imageData.imageUrl || noImage);
        setOverView(imageData.overView || "");
        if (type === "Unknown" && imageData.type) {
          setType(imageData.type);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageUrl(noImage);
      }
    };

    fetchAndSetImage();
  }, [id]);

  console.log(imageUrl);
  console.log(type);

  useEffect(() => {
    if (type === "person") {
      setLinkTo("person");
    }
  }, [type]); // Dependencies added here

  const title =
    movie?.primaryTitle || movie?.originalTitle || movie?.name || "Untitled";
  console.log(title);

  if (!id) {
    console.warn("Movie card received invalid data:", movie);
    return null;
  }

  return (
    <Link to={`/${linkTo}/${id}`}state={{imageUrl,title,type,overView}} className="text-decoration-none h-100">
      <Card className="h-100 bg-dark text-white border-0 movie-card">
        <div className="position-relative" style={{ height: "300px" }}>
          <Card.Img
            variant="top"
            src={imageUrl}
            alt={title}
            className="movie-poster rounded"
            onError={(e) => {
              e.target.src = noImage;
            }}
            style={{
              height: "100%",
              objectFit: "cover",
              width: "100%",
            }}
          />
          {authTokens?.userId && movieId && (
            <Button
              variant="link"
              onClick={handleBookmark}
              disabled={loading}
              className="position-absolute top-0 end-0 m-2 bookmark-button p-2"
            >
              <BookmarkIcon size={20} style={bookmarkStyle} />
            </Button>
          )}
        </div>
        <Card.Body className="p-3 d-flex flex-column">
          <Card.Title className="text-warning mb-2 text-truncate fw-bold">
            {title}
          </Card.Title>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-warning text-dark">{type}</span>
            <small className="text-muted">{id}</small>
          </div>
          {overView && (
            <Card.Text
              className="text-white small movie-overview overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical",
              }}
            >
              {overView}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Link>
  );
}

export default MovieCard;
