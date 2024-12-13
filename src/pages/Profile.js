import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Card,
  ListGroup,
  Button,
  Row,
  Col,
  Spinner,
  Badge,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  getUserBookmarks,
  getUserRatingsWithMovies,
} from "../services/MovieService";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { FaStar } from "react-icons/fa";

function Profile() {
  const { authTokens, logout } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    if (!authTokens?.userId) return;

    try {
      console.log('Fetching bookmarks for user:', authTokens.userId);
      const bookmarkedMovies = await getUserBookmarks(authTokens.userId);
      console.log('Received bookmarks:', bookmarkedMovies);
      setBookmarks(bookmarkedMovies);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  useEffect(() => {
    // Dynamically import Bootstrap's JavaScript
    import("bootstrap/dist/js/bootstrap.bundle.min.js");

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${authTokens.userId}`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchRatings = async () => {
      if (!authTokens?.userId) return;

      try {
        setRatingsLoading(true);
        const userRatings = await getUserRatingsWithMovies(authTokens.userId);
        setRatings(userRatings);
      } catch (error) {
        console.error("Error fetching ratings:", error);
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
    navigate("/", { replace: true });
  };

  const handleBookmarkRemove = async (movieId) => {
    setBookmarks((prev) => prev.filter((movie) => movie.tconst !== movieId));
  };

  useEffect(() => {
    const handleFocus = () => {
      fetchBookmarks();
    };

    window.addEventListener("focus", handleFocus);
    fetchBookmarks();

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [authTokens]);

  return (
    <div className="min-vh-100 bg-dark">
      {/* Profile Content */}
      <Container className="py-5">
        <Row>
          <Col xs={12} md={4} className="mb-4">
            {/* Profile Card */}
            <Card className="bg-black text-white border-0">
              <Card.Body className="text-center">
                <div className="mb-4">
                  <img
                    src="https://picsum.photos/200"
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <h3 className="card-title">
                  {userDetails?.username || "Loading..."}
                </h3>
                <p>{userDetails?.email || ""}</p>
                <Button
                  variant="warning"
                  className="mt-3"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={8}>
            {/* Ratings Section */}
            <Card className="bg-black text-white border-0 mb-4">
              <Card.Body>
                <h4 className="card-title mb-4" style={{ color: "#F5C518" }}>
                  My Ratings
                </h4>
                {ratingsLoading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : ratings.length === 0 ? (
                  <p className="text-center">
                    You haven't rated any movies yet.
                  </p>
                ) : (
                  <div className="list-group list-group-flush">
                    {ratings.map((rating) => (
                      <div
                        key={rating.tConst}
                        className="list-group-item bg-black text-white border-bottom border-secondary"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">
                            <a
                              href={`/movie/${rating.tConst}`}
                              className="text-decoration-none text-white"
                            >
                              {rating.movieTitle}
                            </a>
                          </h6>
                          <span className="text-warning">
                            ⭐ {rating.rating}/10
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Bookmarks Section */}
            <Card className="bg-black text-white border-0">
              <Card.Body>
                <h4 className="card-title mb-4" style={{ color: "#F5C518" }}>
                  My Bookmarks
                </h4>
                {bookmarks.length === 0 ? (
                  <p className="text-center">
                    You haven't bookmarked any movies yet.
                  </p>
                ) : (
                  <div className="list-group list-group-flush">
                    {bookmarks.map((movie) => (
                      <div
                        key={movie.tconst}
                        className="list-group-item bg-black text-white border-bottom border-secondary"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">
                            <Link 
                              to={`/movie/${movie.tconst}`}
                              className="text-decoration-none text-white"
                            >
                              {movie.primaryTitle || movie.title}
                            </Link>
                          </h6>
                          <div>
                            <span className="me-2">{movie.startYear || movie.year}</span>
                            {movie.averageRating && (
                              <Badge bg="warning" text="dark">
                                ⭐ {movie.averageRating}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Profile;
