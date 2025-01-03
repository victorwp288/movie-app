import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Spinner,
  Badge,
  Alert,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  getUserBookmarks,
  getUserRatingsWithMovies,
} from "../services/MovieService";
import Footer from "../components/Footer";
import { removeUser } from "../services/MovieService";
import PasswordModal from "../components/PasswordModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

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

    const fetchBookmarks = async () => {
      if (!authTokens?.userId) return;
      try {
        const bookmarkedMovies = await getUserBookmarks(authTokens.userId);
        setBookmarks(bookmarkedMovies);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
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

  useEffect(() => {
    const handleFocus = () => {
      const fetchBookmarks = async () => {
        if (!authTokens?.userId) return;
        try {
          const bookmarkedMovies = await getUserBookmarks(authTokens.userId);
          setBookmarks(bookmarkedMovies);
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      };
      fetchBookmarks();
    };

    window.addEventListener("focus", handleFocus);
    handleFocus();

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [authTokens]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const [showModal, setShowModal] = useState(false);

  const handlePasswordChange = (newPassword) => {
    console.log("New Password:", newPassword);
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
      navigate("/", { replace: true });
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

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

                <div className="d-flex justify-content-between align-items-center gap-2">
                  <Button
                    variant="danger"
                    className="mt-3 flex-fill"
                    style={{ height: "60px" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>

                  <Button
                    variant="warning"
                    className="mt-3 flex-fill"
                    style={{ height: "60px" }}
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </Button>

                  <Button
                    variant="danger"
                    className="mt-3 flex-fill"
                    style={{ height: "60px" }}
                    onClick={handleDeleteUser}
                  >
                    Remove Account
                  </Button>
                </div>

                {showAlertPasCh && (
                  <Alert
                    variant="success"
                    onClose={() => setShowAlertPasCh(false)}
                    dismissible
                  >
                    Password successfully changed!
                  </Alert>
                )}

                <PasswordModal
                  isOpen={showModal}
                  onClose={() => setShowModal(false)}
                  onSubmit={handlePasswordChange}
                  userDet={userDetails}
                />

                <DeleteConfirmationModal
                  isOpen={showDeleteModal}
                  onClose={handleCancelDelete}
                  onConfirm={handleConfirmDelete}
                />
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
                              to={`/movie/${movie.tConst}`}
                              className="text-decoration-none text-white"
                            >
                              {movie.primaryTitle || movie.title}
                            </Link>
                          </h6>
                          <div>
                            <span className="me-2">
                              {movie.startYear || movie.year}
                            </span>
                            {movie.averageRating && (
                              <Badge bg="white" text="dark">
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
