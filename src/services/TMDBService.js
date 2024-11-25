const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_API_URL = "https://api.themoviedb.org/3";

export const getPersonImage = async (imdbId) => {
  try {
    // First, find the TMDB person ID
    const findResponse = await fetch(
      `${TMDB_API_URL}/find/${imdbId}?external_source=imdb_id&api_key=${TMDB_API_KEY}`
    );
    if (!findResponse.ok) {
      throw new Error("Failed to find person");
    }
    const findData = await findResponse.json();
    if (!findData.person_results || findData.person_results.length === 0) {
      throw new Error("No person results found");
    }
    const personId = findData.person_results[0].id;

    // Now, get the person's images
    const imagesResponse = await fetch(
      `${TMDB_API_URL}/person/${personId}/images?api_key=${TMDB_API_KEY}`
    );
    if (!imagesResponse.ok) {
      throw new Error("Failed to get person images");
    }
    const imagesData = await imagesResponse.json();
    if (!imagesData.profiles || imagesData.profiles.length === 0) {
      return null;
    }
    const imagePath = imagesData.profiles[0].file_path;
    const imageUrl = `https://image.tmdb.org/t/p/w500${imagePath}`;
    return imageUrl;
  } catch (error) {
    console.error("Error fetching person image", error);
    return null;
  }
};
