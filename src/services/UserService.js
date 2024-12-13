const API_URL = process.env.REACT_APP_API_URL;

export const removeUser = async (userId) => {
  console.log('Removing bookmark:', `${API_URL}/users/${userId}/delete`);
  try {
    const response = await fetch(`${API_URL}/users/${userId}/delete`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove user');
    }
    
    return true;
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
};