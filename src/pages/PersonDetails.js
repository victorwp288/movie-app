import React, { useState, useEffect, useContext } from "react";
import { useParams,useLocation } from "react-router-dom";
import { getMovieDetails, addBookmark, rateMovie, getUserBookmarks, removeBookmark, getUserRating } from "../services/MovieService";
import { Container, Button, Card, Row, Col, Badge, Spinner, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { FaStar, FaRegStar, FaBookmark } from 'react-icons/fa';

function PersonDetails() {
    const location = useLocation() ;
    console.log('location.state in MovieListPage:', location.state);
    const imageUrl = location.state ? location.state.imageUrl : '';
    const title = location.state ? location.state.title : '';
    const { id } = useParams();
    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={8}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="images-for">
                                        <img
                                            key={id}
                                            src={imageUrl}
                                            alt="Profile"
                                            className="profile-image"
                                        />
                                    </div>
                                    <h1>{title}</h1>
                                </div>
                                <div>
                                    <h1>PersonID:{id}</h1>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}
export default PersonDetails;