import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getPopularMovies } from "../services/MovieService";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getPopularMovies(page, pageSize);
        console.log('Movies data:', data.movies);
        setMovies(data.movies);
        setPagination(data.pagination);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError(err.message);
      }
    };

    fetchMovies();
  }, [page, pageSize]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevPage) {
      setPage((prevPage) => Math.max(prevPage - 1, 0));
    }
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPage(0);
  };

  return (
    <Container>
      <Row>
        {movies.map((movie) => (
          <Col key={movie.tconst} xs={12} md={6} lg={4}>
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button
          variant="primary"
          onClick={handlePreviousPage}
          disabled={!pagination.hasPrevPage}
        >
          Previous
        </Button>
        <span>
          Page {pagination.currentPage + 1} of {pagination.totalPages}
        </span>
        <Button 
          variant="primary" 
          onClick={handleNextPage}
          disabled={!pagination.hasNextPage}
        >
          Next
        </Button>
      </div>
      <Form.Group controlId="pageSizeSelect" className="mt-3">
        <Form.Label>Movies per page:</Form.Label>
        <Form.Control
          as="select"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Form.Control>
      </Form.Group>
    </Container>
  );
}

export default Home;