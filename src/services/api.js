// services/api.js
// For local development
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '192.168.18.20' 
  ? 'http://192.168.18.20:8000'
  : `http://45.189.109.4:8000`;
export const createBet = async (betData) => {
  try {
    const response = await fetch(`${API_URL}/bets/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(betData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating bet:', error);
    throw error;
  }
};

export const getBet = async (betId) => {
  try {
    const response = await fetch(`${API_URL}/bets/${betId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bet:', error);
    throw error;
  }
};

export const listBets = async () => {
  try {
    const response = await fetch(`${API_URL}/bets/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error listing bets:', error);
    throw error;
  }
};

export const signBet = async (betId, initials) => {
  try {
    const response = await fetch(`${API_URL}/bets/${betId}/sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initials }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error signing bet:', error);
    throw error;
  }
};