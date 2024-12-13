const API_URL = process.env.REACT_APP_API_URL;

export const getPopularMovies = async (page = 0, pageSize = 5) => {
  try {
    const url = `${API_URL}/movies?page=${page}&pageSize=${pageSize}`;
    console.log("Attempting to connect to:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
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
        hasPrevPage: data.prevPage !== null,
      },
    };
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      API_URL,
      error,
    });
    throw new Error("Failed to fetch movies. Is the backend server running?");
  }
};

export const getMovieDetails = async (id) => {
  try {
    console.log("Fetching movie details with ID:", id);
    const response = await fetch(`${API_URL}/movies/${encodeURIComponent(id)}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Movie not found");
      }
      throw new Error(`Failed to fetch movie details (${response.status})`);
    }

    const data = await response.json();
    console.log("Movie details response:", data);
    return data;
  } catch (error) {
    console.error("Error in getMovieDetails:", error);
    throw error;
  }
};

export const addBookmark = async (userId, tconst, note = "") => {
  try {
    tconst = tconst.trim();
    console.log("Adding bookmark:", { userId, tconst, note });

    if (!tconst) {
      throw new Error("Movie ID (tconst) is required");
    }
    console.log(
      "Fetching bookmark API URL:",
      `${API_URL}/users/${userId}/${tconst}/bookmark`
    );
    const response = await fetch(
      `${API_URL}/users/${userId}/${tconst}/bookmark`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          userId: userId,
          tconst: tconst,
          note: note,
          bookmarkDate: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bookmark API error:", errorText);
      throw new Error(`Failed to add bookmark: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error adding bookmark:", error);
    throw error;
  }
};

export const removeBookmark = async (userId, tconst) => {
  console.log(tconst.length);
  tconst = tconst.trim();
  console.log(
    "Removing bookmark:",
    `${API_URL}/users/${userId}/${tconst}/bookmark`
  );
  try {
    const response = await fetch(
      `${API_URL}/users/${userId}/${tconst}/bookmark`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove bookmark");
    }

    return true;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw error;
  }
};

export const getUserBookmarks = async (userId) => {
  try {
    // Fetch bookmarks
    const response = await fetch(`${API_URL}/users/${userId}/bookmarks`);
    if (!response.ok) {
      throw new Error("Failed to fetch bookmarks");
    }
    const bookmarks = await response.json();
    console.log("Bookmarks:", bookmarks);

    // Get unique bookmarks with cleaned tconst
    const uniqueBookmarks = [
      ...new Set(
        bookmarks.map((b) => ({
          ...b,
          tconst: b.tconst.trim(),
        }))
      ),
    ];

    // Fetch movie details for each bookmark
    const moviePromises = uniqueBookmarks.map(async (bookmark) => {
      try {
        const movieResponse = await fetch(
          `${API_URL}/movies/${bookmark.tconst}`
        );
        if (!movieResponse.ok) return null;

        const movieData = await movieResponse.json();
        return {
          ...movieData,
          note: bookmark.note,
          bookmarkDate: bookmark.bookmarkDate,
        };
      } catch {
        return null;
      }
    });

    // Get all movie details and filter out failed requests
    const movies = (await Promise.all(moviePromises)).filter(Boolean);
    console.log("Bookmarked movies:", movies);
    return movies;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
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
    const response = await fetch(
      `${API_URL}/movies/search/${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error searching all movies", error);
    return [];
  }
};

export const searchMovieTitles = async (query) => {
  try {
    console.log("Searching titles with query:", query);
    const response = await fetch(
      `${API_URL}/movies/search/titles/${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Search failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Search response:", data);
    return data;
  } catch (error) {
    console.error("Error searching movie titles:", error);
    throw error;
  }
};

export const searchDatabaseTitles = async (query) => {
  try {
    const response = await fetch(
      `${API_URL}/movies/search/titles/database/${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error searching database titles", error);
    return [];
  }
};

export const searchPersons = async (query) => {
  try {
    const response = await fetch(
      `${API_URL}/movies/search/persons/${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error searching persons", error);
    return [];
  }
};

export const searchMoviesForUser = async (query, userId) => {
  try {
    const response = await fetch(
      `${API_URL}/movies/search/titles/${encodeURIComponent(query)}/${userId}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error searching movies for user", error);
    return [];
  }
};

export const searchDatabaseForUser = async (query, userId) => {
  try {
    const response = await fetch(
      `${API_URL}/movies/search/titles/database/${encodeURIComponent(
        query
      )}/${userId}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error searching database for user", error);
    return [];
  }
};

export const getUserRatings = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/rating`);
    if (!response.ok) {
      throw new Error("Failed to fetch user ratings");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    throw error;
  }
};

export const getUserRating = async (userId, tconst) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/${tconst}/rating`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch user rating");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return null;
  }
};

export const getUserRatingsWithMovies = async (userId) => {
  try {
    // Get user ratings
    const ratings = await getUserRatings(userId);

    // Get all movies in one request
    const moviesResponse = await fetch(`${API_URL}/movies`);
    if (!moviesResponse.ok) {
      throw new Error("Failed to fetch movies");
    }
    const moviesData = await moviesResponse.json();
    const movies = moviesData.items || [];

    // Match ratings with movie details and fetch missing movies
    const ratingsWithMovies = await Promise.all(
      ratings.map(async (rating) => {
        let movie = movies.find((m) => m.tconst === rating.tConst);

        // If movie not found in initial batch, fetch it individually
        if (!movie) {
          try {
            movie = await getMovieDetails(rating.tConst);
          } catch (error) {
            console.error(
              `Failed to fetch details for movie ${rating.tConst}:`,
              error
            );
          }
        }

        return {
          ...rating,
          movieTitle: movie ? movie.primaryTitle : rating.tConst,
        };
      })
    );

    return ratingsWithMovies;
  } catch (error) {
    console.error("Error fetching ratings with movies:", error);
    throw error;
  }
};

export const getMovieReviewWords = async (movieId) => {
  try {
    // Get user ratings which include reviews
    const response = await fetch(`${API_URL}/users/rating`);
    if (!response.ok) throw new Error("Failed to fetch ratings");
    const ratings = await response.json();

    // Filter ratings for this movie and extract review text
    const movieRatings = ratings.filter(
      (r) => r.tConst === movieId && r.review
    );

    // Create word frequency map from reviews
    const wordMap = {};
    movieRatings.forEach((rating) => {
      const words = rating.review.split(/\s+/);
      words.forEach((word) => {
        wordMap[word] = (wordMap[word] || 0) + 1;
      });
    });

    // Convert to word cloud format
    return Object.entries(wordMap).map(([word, freq]) => ({
      text: word,
      size: Math.min(60, Math.max(20, freq * 10)),
    }));
  } catch (error) {
    console.error("Error creating review word cloud:", error);
    return [];
  }
};

export const getMovieGenreWords = async (movieId) => {
  try {
    const movie = await getMovieDetails(movieId);
    if (!movie?.genres?.length) return [];

    // Use the genres we already have from movie details
    return movie.genres.map((genre) => ({
      text: genre,
      size: 40,
    }));
  } catch (error) {
    console.error("Error creating genre word cloud:", error);
    return [];
  }
};

export const getMovieCastWords = async (movieId) => {
  try {
    // Use the existing movie details endpoint
    const movie = await getMovieDetails(movieId);
    // Since we don't have cast data in the current API,
    // we could use other available data like title variants
    return [
      { text: movie.primaryTitle, size: 50 },
      { text: movie.originalTitle, size: 40 },
    ];
  } catch (error) {
    console.error("Error creating cast word cloud:", error);
    return [];
  }
};

export const getRelatedMovieWords = async (movieId) => {
  try {
    // Use the search endpoint with the movie's title
    const movie = await getMovieDetails(movieId);
    const searchResults = await searchMovies(movie.primaryTitle);

    // Filter out the current movie and transform to word cloud format
    return searchResults
      .filter((m) => m.tConst !== movieId)
      .slice(0, 10)
      .map((m) => ({
        text: m.primaryTitle,
        size: 35,
      }));
  } catch (error) {
    console.error("Error creating related movies word cloud:", error);
    return [];
  }
};
