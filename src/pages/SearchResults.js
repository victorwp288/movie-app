import React, { useState, useEffect, useContext, useCallback } from "react";
import { 
  searchAllMovies, 
  searchMovieTitles, 
  searchDatabaseTitles, 
  searchPersons,
  searchMoviesForUser,
  searchDatabaseForUser 
} from "../services/MovieService";
import MovieCard from "../components/MovieCard";
import { Container, Row, Col, Form, Button, ButtonGroup, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const searchQuery = query.get("q") || "";
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [searchType, setSearchType] = useState("titles");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchDuration, setSearchDuration] = useState(null);
  
  const { authTokens } = useContext(AuthContext);
  const userId = authTokens?.userId;

  const performSearch = useCallback(async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    setError(null);
    const startTime = performance.now();
    
    try {
      let results;
      const searchTermTrimmed = searchTerm.trim();
      
      console.log('Performing search with:', { searchTermTrimmed, searchType });
      
      switch (searchType) {
        case "all":
          results = await searchAllMovies(searchTermTrimmed);
          break;
        case "titles":
          results = userId 
            ? await searchMoviesForUser(searchTermTrimmed, userId)
            : await searchMovieTitles(searchTermTrimmed);
			console.log('Results:', results);
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
      
      console.log('Search results:', results);
      
      if (Array.isArray(results)) {
        setMovies(results);
      } else {
        console.error('Unexpected results format:', results);
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
  }, [searchTerm, searchType, userId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      window.history.pushState(
        {}, 
        '', 
        `/search?q=${encodeURIComponent(searchTerm)}&type=${searchType}`
      );
      performSearch();
    }
  };

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="align-items-end">
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                Search Movies 
                {searchDuration && !loading && (
                  <small className="text-muted ms-2">
                    (Last search: {searchDuration}ms)
                  </small>
                )}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter search term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <ButtonGroup>
              <Button
                variant={searchType === "titles" ? "primary" : "outline-primary"}
                onClick={() => setSearchType("titles")}
              >
                Titles
              </Button>
              <Button
                variant={searchType === "database" ? "primary" : "outline-primary"}
                onClick={() => setSearchType("database")}
              >
                Database
              </Button>
              <Button
                variant={searchType === "persons" ? "primary" : "outline-primary"}
                onClick={() => setSearchType("persons")}
              >
                Persons
              </Button>
              <Button
                variant={searchType === "all" ? "primary" : "outline-primary"}
                onClick={() => setSearchType("all")}
              >
                All
              </Button>
            </ButtonGroup>
          </Col>
          <Col md={2}>
            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                "Search"
              )}
            </Button>
          </Col>
        </Row>
      </Form>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <div className="mb-3">
            {searchTerm && (
              <p>Found {movies.length} results for "{searchTerm}"</p>
            )}
          </div>
          
          <Row>
            {movies.map((movie) => (
              <Col key={movie.id} xs={12} md={6} lg={4}>
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
        </>
      )}

      {!loading && movies.length === 0 && searchTerm && (
        <div className="text-center mt-4">
          <p>No results found for "{searchTerm}"</p>
        </div>
      )}
    </Container>
  );
}

export default SearchResults;
