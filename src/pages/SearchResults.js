import React, { useState, useEffect, useContext } from "react";
import {
  searchAllMovies,
  searchMovieTitles,
  searchDatabaseTitles,
  searchPersons,
  searchMoviesForUser,
  searchDatabaseForUser,
} from "../services/MovieService";
import MovieCard from "../components/MovieCard";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";

function lowercaseFirstLetter(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get("q") || "";
  const searchType = lowercaseFirstLetter(query.get("type")) || "titles";
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchDuration, setSearchDuration] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");

  const { authTokens } = useContext(AuthContext);
  const userId = authTokens?.userId;

  useEffect(() => {
    // Dynamically import Bootstrap's JavaScript
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm || !searchType) return;

      setLoading(true);
      setError(null);
      const startTime = performance.now();

      try {
        let results;
        const searchTermTrimmed = searchTerm.trim();

        switch (searchType) {
          case "all":
            results = await searchAllMovies(searchTermTrimmed);
            break;
          case "titles":
            results = await searchMovieTitles(searchTermTrimmed);
            break;
          case "database":
            results = userId
              ? await searchDatabaseForUser(searchTermTrimmed, userId)
              : await searchDatabaseTitles(searchTermTrimmed);
            break;
          case "persons":
            results = await searchPersons(searchTermTrimmed);
            break;
          default:
            results = await searchMovieTitles(searchTermTrimmed);
        }

        if (Array.isArray(results)) {
          setMovies(results);
        } else {
          setMovies([]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message || 'An error occurred while searching');
        setMovies([]);
      } finally {
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        setSearchDuration(duration);
        setLoading(false);
      }
    };

    if (searchTerm.trim()) {
      performSearch();
    }
  }, [searchTerm, searchType, userId]);

  return (
    <div className="min-vh-100 bg-dark">
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
              <h2 className="text-white mb-3 mb-md-0">
                Search Results for "{searchTerm}"
              </h2>
            </div>
            {searchDuration && (
              <p className="text-muted mb-0">
                Found {movies.length} results in {searchDuration}ms
              </p>
            )}
          </Col>
        </Row>

        {error && (
          <div className="alert alert-danger bg-danger bg-opacity-25 text-white border-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
              {movies.map((movie) => (
                <div className="col" key={movie.id || movie.tconst}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && movies.length === 0 && searchTerm && (
          <div className="text-center text-white py-5">
            <div className="bg-black bg-opacity-50 rounded p-4">
              <h3 className="mb-3">No results found for "{searchTerm}"</h3>
              <p className="text-muted mb-0">
                Try adjusting your search terms or browse our trending movies
              </p>
            </div>
          </div>
        )}
      </Container>

      <Footer />
    </div>
  );
}

export default SearchResults;
