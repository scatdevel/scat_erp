 
import axios from 'axios';


const API_URL = 'http://localhost:8080/users';


export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}` );
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};





export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // If you need to send cookies
    });
    console.log('User registered successfully', response.data);
  } catch (error) {
    console.error('Error registering user:', error);
  }
};




 export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:8080/users/login', credentials);
    const token = response.data.token;
    localStorage.setItem('jwtToken', token);
    // Proceed with login success actions (e.g., redirecting the user)
  } catch (error) {
    console.error('Login error:', error);
  }
};






