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

function lowercaseFirstLetter(str) {
  if (str.length === 0) return str; // Handle empty strings
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
  //const [searchTerm, setSearchTerm] = useState(searchQuery);
  //const [searchType, setSearchType] = useState(searchTypeFromNev);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchDuration, setSearchDuration] = useState(null);
  
  const { authTokens } = useContext(AuthContext);
  const userId = authTokens?.userId;
  
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm || !searchType) return;
      
      setLoading(true);
      setError(null);
      const startTime = performance.now();
      //searchType=lowercaseFirstLetter(searchType);
      console.log('searchTerm:', searchTerm);
      console.log('searchType:', searchType);
      
      try {
        let results;
        const searchTermTrimmed = searchTerm.trim();
        
        console.log('Performing search with:', { searchTermTrimmed, searchType });
        
        switch (searchType) {
          case "all":
            results = await searchAllMovies(searchTermTrimmed);
            break;
          case "titles":
            results = await searchMovieTitles(searchTermTrimmed);
            console.log(results);
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
    };
    if (searchTerm.trim()) { // Only perform search if searchTerm is not empty
      performSearch();
    }

  },[searchTerm, searchType]);
  
  

  return (
    <Container className="mt-4">
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
