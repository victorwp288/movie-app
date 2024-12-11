const API_URL = process.env.REACT_APP_API_URL;

export const getPersonDetails = async (nconst) => {
    try {
        const url = `${API_URL}/persons/${encodeURIComponent(nconst)}`;
        console.log('Fetching person details with ID:', nconst, 'URL:', url);
        const response = await fetch(url);

        if (!response.ok) {
            const message = `HTTP error fetching person details for ${nconst}: ${response.status} ${response.statusText}`;
            throw new Error(message); 
        }

        const data = await response.json();
        console.log('Person details:', data);
        return { data, error: null }; 

    } catch (error) {
        console.error("Error fetching person details:", {
            message: error.message,
            API_URL,
            nconst, 
            error
        });
        return { data: null, error: 'Failed to fetch person details. Please check the backend server and try again.' }; 
    }
};