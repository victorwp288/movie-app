const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_API_URL = "https://api.themoviedb.org/3";

export const getImage = async (imdbId) => {
  const result={imageUrl:"../img/No_Image_Available.jpg",type:"unknown"};
  console.log("getImage called with imdbId:", imdbId); // Log the input
  try {
    const apiUrl = `${TMDB_API_URL}/find/${imdbId}?external_source=imdb_id&api_key=${TMDB_API_KEY}`;
    console.log("API URL:", apiUrl); // Log the full API URL
    const findResponse = await fetch(apiUrl);
    if (!findResponse.ok) {
      const errorData = await findResponse.json(); // Try to get error details
      console.error("fetch failed with status", findResponse.status, errorData);
      throw new Error(`Failed to find person: ${findResponse.status} ${JSON.stringify(errorData)}`);
    }
    const findData = await findResponse.json();
    console.log("Id:",imdbId);
    console.log("TMDB data:", findData); 

    let imagePath = null;
    
    if(findData.movie_results.length>0){
      imagePath = findData.movie_results[0].poster_path;
      result.type="movie";
    }
    else if(findData.person_results.length>0){
      imagePath = findData.person_results[0].profile_path;
      result.type="person";
    }
    else if(findData.tv_results.length>0){
      imagePath = findData.tv_results[0].poster_path;
      result.type="tv";
    }
    else if(findData.tv_episode_results.length>0){
      imagePath = findData.tv_episode_results[0].still_path;
      result.type="tvEpisode";
    }
    else if(findData.tv_season_results.length>0){
      imagePath = findData.tv_season_results[0].poster_path;
      result.type="tvSeason";
    }
    else{
      throw new Error("No image path found");
    }
    if (!imagePath) {
      throw new Error("No image path found");
    }
    console.log("Image path:", imagePath);
    result.imageUrl = `https://image.tmdb.org/t/p/w200${imagePath}`;
    console.log("return:", result);
    return result;
    

  } catch (error) {
    console.error("Error fetching person image:", error);
    return result;
  }
};