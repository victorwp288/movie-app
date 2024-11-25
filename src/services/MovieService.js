const API_URL = process.env.REACT_APP_API_URL;

export const getPopularMovies = async (page = 0, pageSize = 5) => {
  try {
    const url = `${API_URL}/movies?page=${page}&pageSize=${pageSize}`;
    console.log('Attempting to connect to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      movies: data.items || [],
      pagination: {
        currentPage: page,
        totalPages: data.numberPages || 0,
        totalItems: data.numberOfItems || 0,
        hasNextPage: data.nextPage !== null,
        hasPrevPage: data.prevPage !== null
      }
    };
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      API_URL,
      error
    });
    throw new Error('Failed to fetch movies. Is the backend server running?');
  }
};

export const getMovieDetails = async (id) => {
  try {
    console.log('Fetching movie details with ID:', id);
    const response = await fetch(`${API_URL}/movies/${encodeURIComponent(id)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Movie not found');
      }
      throw new Error(`Failed to fetch movie details (${response.status})`);
    }
    
    const data = await response.json();
    console.log('Movie details response:', data);
    return data;
  } catch (error) {
    console.error('Error in getMovieDetails:', error);
    throw error;
  }
};

export const addBookmark = async (userId, tconst) => {
  try {
    console.log('Adding bookmark:', { userId, tconst });
    
    if (!tconst) {
      throw new Error('Movie ID (tconst) is required');
    }

    const response = await fetch(`${API_URL}/users/${userId}/${tconst}/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify({
        note: "",
        createdAt: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bookmark API error:', errorText);
      throw new Error(`Failed to add bookmark: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

export const removeBookmark = async (userId, tconst) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/${tconst}/bookmark`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove bookmark');
    }
    
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

export const getUserBookmarks = async (userId) => {
  try {
    const bookmarksResponse = await fetch(`${API_URL}/users/${userId}/bookmarks`);
    if (!bookmarksResponse.ok) {
      throw new Error('Failed to fetch bookmarks');
    }
    const bookmarks = await bookmarksResponse.json();
    console.log('Raw bookmarks:', bookmarks);

    // Get all movies in one request
    const moviesResponse = await fetch(`${API_URL}/movies`);
    if (!moviesResponse.ok) {
      throw new Error('Failed to fetch movies');
    }
    const moviesData = await moviesResponse.json();
    const movies = moviesData.items || [];

    // Match movies with bookmarks
    const bookmarkedMovies = movies.filter(movie => 
      bookmarks.some(bookmark => bookmark.tconst === movie.tconst)
    ).map(movie => ({
      ...movie,
      isBookmarked: true
    }));

    console.log('Bookmarked movies:', bookmarkedMovies);
    return bookmarkedMovies;
  } catch (error) {
    console.error('Error in getUserBookmarks:', error);
    throw error;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${API_URL}/movies/search/titles/${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const movies = await response.json();
    return movies;
  } catch (error) {
    console.error("Error searching movies", error);
    return [];
  }
};

export const rateMovie = async (userId, movieId, rating) => {
  try {
    const response = await fetch(
      `${API_URL}/users/${userId}/${movieId}/rating/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      }
    );
    if (!response.ok) {
      console.error("Failed to rate movie");
    }
  } catch (error) {
    console.error("Error rating movie", error);
  }
};

export const searchAllMovies = async (query) => {
  try {
    const response = await fetch(`${API_URL}/movies/search/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error searching all movies", error);
    return [];
  }
};

export const searchMovieTitles = async (query) => {
  try {
    console.log('Searching titles with query:', query);
    const response = await fetch(`${API_URL}/movies/search/titles/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Search failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Search response:', data);
    return data;
  } catch (error) {
    console.error("Error searching movie titles:", error);
    throw error;
  }
};

export const searchDatabaseTitles = async (query) => {
  try {
    const response = await fetch(`${API_URL}/movies/search/titles/database/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error searching database titles", error);
    return [];
  }
};

export const searchPersons = async (query) => {
  try {
    const response = await fetch(`${API_URL}/movies/search/persons/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error searching persons", error);
    return [];
  }
};

export const searchMoviesForUser = async (query, userId) => {
  try {
    const response = await fetch(`${API_URL}/movies/search/titles/${encodeURIComponent(query)}/${userId}`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error searching movies for user", error);
    return [];
  }
};

export const searchDatabaseForUser = async (query, userId) => {
  try {
    const response = await fetch(`${API_URL}/movies/search/titles/database/${encodeURIComponent(query)}/${userId}`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error searching database for user", error);
    return [];
  }
};
