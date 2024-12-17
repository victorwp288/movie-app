import React, { useState, useEffect } from "react";
import { useParams,useLocation } from "react-router-dom";
import { getPersonDetails } from "../services/PersonService";
import {getMovieDetails} from "../services/MovieService";
import { Container, Button, Card, Row, Col, Badge, Spinner, Form } from "react-bootstrap";
import MovieCard from "../components/MovieCard";
import { getImage } from "../services/TMDBService";

function PersonDetails() {
    const location = useLocation() ;
    //console.log('location.state in MovieListPage:', location.state);
    const [imageUrl,setImageUrl] =useState(null);
    const title = location.state ? location.state.title : '';
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [person, setPerson] = useState(null);
    const [yearOfBirth, setYearOfBirth] = useState(null);
    const [yearOfDeath, setYearOfDeath] = useState(null);
    const [professions, setProfessions] = useState([]);
    const [movies, setMovies] = useState([]);
    
    const fetchImage = async () => {
      if (imageUrl) {
        return;
      }else{
        const imageDataNType = await getImage(id.trim());
        setImageUrl(imageDataNType.imageUrl);
        console.log("imageUrl:", imageUrl);
      }
    };
    useEffect(() => {
    const fetchPersonDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const nconst = id.trim();
            console.log('Fetching person details for Nconst:', nconst);
            const data = await getPersonDetails(nconst);
            console.log('Person details:', data);
            setPerson(data.data); // Corrected spelling here
        } catch (err) {
            console.error('Error fetching Person details:', err);
            setError(err.message || 'Failed to load Person details');
        } finally {
            setLoading(false);
        }
    };
    if (id) {
        fetchPersonDetails();
        fetchImage();
    }
    }, [id]);  

    useEffect(() => {
        if (person) {
            console.log('Person:', person);
            const trimmedBYear = person.birthYear.trim();
            setYearOfBirth(trimmedBYear === "" ? null : trimmedBYear);
            const trimmedDYear = person.deathYear.trim();
            setYearOfDeath(trimmedDYear === "" ? null : trimmedDYear);
            setProfessions(person.personProfessions);
            //setKnownFor(person.personKnownTitles);
            const fetchMovies = async () => {
              if (person.personKnownTitles.length > 0) {
                try {
                  const moviePromises = person.personKnownTitles.map((movieKF) =>
                    getMovieDetails(movieKF.tconst)
                  );
                  const movies = await Promise.all(moviePromises);
                  setMovies(movies); // Update state with fetched movies
                } catch (error) {
                  console.error("Error fetching movies:", error);
                  setError("Failed to load movies."); //Set error message
                }
              }
            };
          
            fetchMovies();
        }
    }, [person]);

    console.log('Movies:', movies.length);

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
    
      if (!person) {
        return (
          <Container className="mt-4">
            <div className="alert alert-warning" role="alert">
                Person not found
            </div>
          </Container>
        );
      }
    
    
    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={8}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <div className="position-relative" >
                                        <img
                                            key={id}
                                            src={imageUrl}
                                            alt="Profile"
                                            className="img-fluid rounded"
                                            style={{ height: "300px", width: "200px" }}
                                        />
                                    </div>
                                    <h2>{title}</h2>
                                </div>
                                <div className="d-flex flex-column align-items-left">
                                  {yearOfBirth && <div>
                                      <h5>Birth Year:{yearOfBirth}</h5>
                                  </div>}
                                  {yearOfDeath && <div>
                                      <h5>Death Day:{yearOfDeath}</h5>
                                  </div>}
                                  {professions && (
                                    <div className="mt-3">
                                      {professions.length > 0 && (
                                        <>Professions: {/* React Fragment */}
                                          {professions.map((p) => (
                                            <Badge bg="secondary" className="me-2" key={p.id}>
                                              {p.profession.charAt(0).toUpperCase() + p.profession.slice(1)}
                                            </Badge>
                                          ))}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
             {/* Title Known For */}
            <Card className="mt-4">
                <Card.Header as="h4">Person is Known For:</Card.Header>
                <Card.Body>
                  {movies.length === 0 ? (
                      <p className="text-center">No Movies Avelable for the Person.</p>
                  ) : (
                    <Row>
                    {movies.map((movie) => (
                      <Col key={movie.tconst} xs={12} md={6} lg={4}>
                        <MovieCard movie={movie} />
                      </Col>
                    ))}
                  </Row>
                  )}
                </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                  <Row>
                      <Col md={8}>
                        <div className="mt-4">
                          <h5>Additional Information:</h5>
                          <p><strong>IMDB ID:</strong> {id}</p>
                        </div>
                      </Col>
                  </Row>
              </Card.Body>
            </Card>
        </Container>
    );
}
export default PersonDetails;