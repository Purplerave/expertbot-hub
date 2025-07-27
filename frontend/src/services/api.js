import axios from 'axios';

const API_KEY = 'expb_1234567890abcdef'; // Tu clave API
const BASE_URL = 'https://expertbot-hub.onrender.com/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

export const getBots = async () => {
  try {
    const response = await apiClient.get('/bots');
    return response.data;
  } catch (error) {
    console.error("Error fetching bots:", error);
    throw error;
  }
};

export const sendMessage = async (payload) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
