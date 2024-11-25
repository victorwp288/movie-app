const API_URL = process.env.REACT_APP_API_URL;

export const login = async (username, password) => {
  try {
    const requestBody = {
      username,
      password
    };
    
    console.log('Login Request URL:', `${API_URL}/users/login`);
    console.log('Login Request Body:', requestBody);

    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Transform the response into the format we want to store
    return {
      token: data.token,
      userId: data.userId,
      username: username
    };
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      error
    });
    throw error;
  }
};
