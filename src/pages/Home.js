import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getPopularMovies } from "../services/MovieService";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Footer from "../components/Footer";
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
    // Dynamically import Bootstrap's JavaScript
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

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
    return <div className="text-white">Error: {error}</div>;
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
    <div className="min-vh-100 bg-dark">

      {/* Hero Section */}
      <div className="position-relative" style={{ height: '600px' }}>
        <img
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000"
          alt="Featured Movie"
          className="w-100 h-100 object-fit-cover position-absolute"
          style={{ zIndex: -1 }}
        />
        <div className="position-absolute w-100 h-100" 
             style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}>
          <div className="container h-100">
            <div className="row h-100 align-items-center">
              <div className="col-12 col-md-6 text-white">
                <h1 className="display-4 fw-bold mb-4">Featured Movie Title</h1>
                <p className="lead mb-4">
                  A compelling description of the featured movie that captures attention and
                  drives interest in watching it.
                </p>
                <button className="btn btn-warning btn-lg px-4">Watch Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Movies Section */}
      <Container className="py-5">
        <h2 className="text-white mb-4">Popular Movies</h2>
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
            {movies.map(movie => (
              <div className="col" key={movie.tconst || movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mt-4">
          <Button
            variant="warning"
            onClick={handlePreviousPage}
            disabled={!pagination.hasPrevPage}
          >
            Previous
          </Button>
          <span className="text-white">
            Page {pagination.currentPage + 1} of {pagination.totalPages}
          </span>
          <Button 
            variant="warning" 
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
        
        <Form.Group controlId="pageSizeSelect" className="mt-3">
          <Form.Label className="text-white">Movies per page:</Form.Label>
          <Form.Select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="bg-dark text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Form.Select>
        </Form.Group>
      </Container>

      {/* Footer */}
      <Footer />
    </div>	
  );
}

export default Home;