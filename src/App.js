import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetails';
import SearchResults from './pages/SearchResults';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route 
          path="/bookmarks" 
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;