import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  getMovieDetails,
  addBookmark,
  rateMovie,
  getUserBookmarks,
  removeBookmark,
  getUserRating
} from "../services/MovieService";
import {
  Container,
  Button,
  Card,
  Row,
  Col,
  Badge,
  Spinner,
  Form,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { FaStar, FaRegStar, FaBookmark } from "react-icons/fa";
import { getImage } from "../services/TMDBService";
import { WordCloud } from "../components/WordCloud";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState("/assets/missing.jpg");
  const [type, setType] = useState(null);
  const [overView, setOverView] = useState(null);
  const [cloudWords, setCloudWords] = useState([]);

  const { authTokens } = useContext(AuthContext);
  const userId = authTokens ? authTokens.userId : null;
  const location = useLocation();
  console.log("location.state in MovieListPage:", location.state);

  useEffect(() => {
    const fetchImage = async () => {
      const imageDataNType = await getImage(id.trim());
      setImageUrl(imageDataNType.imageUrl);
      setType(imageDataNType.type);
      setOverView(imageDataNType.overView);
      console.log("imageUrl:", imageUrl);
      console.log("type:", type);
    };
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const cleanId = id.trim();
        console.log("Fetching movie details for ID:", cleanId);
        const data = await getMovieDetails(cleanId);
        console.log("Movie details:", data);
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(err.message || "Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchMovieDetails();
      fetchImage();
    }
  }, [id, imageUrl, type]);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (userId && movie?.tConst) {
        try {
          const bookmarks = await getUserBookmarks(userId);
          const isMovieBookmarked = bookmarks.some(
            (b) => b.tConst === movie.tConst
          );
          setIsBookmarked(isMovieBookmarked);
        } catch (error) {
          console.error("Error checking bookmark status:", error);
        }
      }
    };

    const fetchUserRating = async () => {
      if (userId && movie?.tConst) {
        try {
          const userRating = await getUserRating(userId, movie.tConst);
          if (userRating) {
            setRating(userRating.rating);
            setReview(userRating.review || "");
          }
        } catch (error) {
          console.error("Error fetching user rating:", error);
        }
      }
    };

    checkBookmarkStatus();
    fetchUserRating();
  }, [userId, movie]);

  useEffect(() => {
    if (movie) {
      // Simplified word collection with consistent format
      const words = [
        // Genres (high weight)
        ...(movie.genres?.map(genre => ({
          text: genre,
          size: 55
        })) || []),

        // Overview words (medium weight)
        ...(overView?.split(/\s+/)
          .filter(word => word.length > 3)
          .map(word => ({
            text: word,
            size: 40
          })) || []),

        // Title words (highest weight)
        ...movie.primaryTitle.split(/\s+/).map(word => ({
          text: word,
          size: 60
        })),

        // Review words (medium weight)
        ...(review?.split(/\s+/)
          .filter(word => word.length > 3)
          .map(word => ({
            text: word,
            size: 45
          })) || [])
      ];

      setCloudWords(words);
    }
  }, [movie, overView, review]);

  const handleBookmark = async () => {
    if (!userId) {
      alert("Please log in to bookmark movies.");
      return;
    }

    const movieId = movie?.tConst;
    if (!movieId) {
      console.error("No movie ID available:", movie);
      alert("Cannot bookmark this movie");
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
      console.error("Error updating bookmark:", error);
      alert("Failed to update bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleRating = async (newRating) => {
    if (!userId) {
      alert("Please log in to rate movies.");
      return;
    }

    setRatingLoading(true);
    try {
      await rateMovie(userId, movie.tConst, newRating, review);
      setRating(newRating);
      alert("Rating submitted successfully!");
    } catch (error) {
      alert("Failed to submit rating");
    } finally {
      setRatingLoading(false);
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
  //if(!imageUrl)setImageUrl(imageUrl);
  console.log("imgUrl:", imageUrl);
  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Row>
            <Col md={8}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="for-image">
                    <img
                      key={id}
                      src={imageUrl}
                      alt="Profile"
                      className="img-fluid rounded"
                      style={{ height: "300px", width: "200px" }}
                    />
                  </div>
                  <h1>{movie.primaryTitle}</h1>
                  {movie.originalTitle !== movie.primaryTitle && (
                    <h5 className="text-muted">
                      Original Title: {movie.originalTitle}
                    </h5>
                  )}
                </div>
                {userId && (
                  <Button
                    variant={isBookmarked ? "warning" : "outline-warning"}
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                  >
                    <FaBookmark /> {isBookmarked ? "Bookmarked" : "Bookmark"}
                  </Button>
                )}
              </div>

              <div className="mt-3">
                {type && (
                  <Badge bg="secondary" className="me-2">
                    {type}
                  </Badge>
                )}
                <Badge bg="secondary" className="me-2">
                  {movie.startYear}
                  {movie.endYear && ` - ${movie.endYear}`}
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
              <div className="mt-3">
                <h5>OverView:</h5>
                <p>{overView || "--Not Available--"}</p>
              </div>

              <div className="mt-4">
                <h5>
                  Average Rating: {movie.averageRating}/10 ({movie.numVotes}{" "}
                  votes)
                </h5>
                {userId && (
                  <div className="mt-3">
                    <h6>Your Rating:</h6>
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <Button
                          key={num}
                          variant={
                            num <= rating ? "warning" : "outline-warning"
                          }
                          onClick={() => setRating(num)}
                          disabled={ratingLoading}
                          size="sm"
                          style={{ minWidth: "35px" }}
                        >
                          {num <= rating ? (
                            <FaStar size={12} />
                          ) : (
                            <FaRegStar size={12} />
                          )}
                        </Button>
                      ))}
                    </div>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleRating(rating);
                      }}
                    >
                      <Form.Group className="mb-3">
                        <Form.Label>Your Review (optional):</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          placeholder="Write your review here..."
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={!rating || ratingLoading}
                      >
                        {ratingLoading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Submitting...
                          </>
                        ) : (
                          "Submit Rating"
                        )}
                      </Button>
                    </Form>
                  </div>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="mt-4">
                  <h5>Genres:</h5>
                  <div>
                    {movie.genres.map((genre, index) => (
                      <Badge key={index} bg="primary" className="me-2">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h5>Additional Information:</h5>
                <p>
                  <strong>IMDB ID:</strong> {movie.tConst}
                </p>
                {movie.url && (
                  <p>
                    <strong>More Info:</strong>{" "}
                    <a
                      href={movie.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on IMDB
                    </a>
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {movie.primaryTitle} Word Cloud
          </h1>
          <WordCloud words={cloudWords} width={600} height={400} />
        </div>
      </div>
    </Container>
  );
}

export default MovieDetails;
