import axios from 'axios';
import { FeatureCollection } from 'geojson';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const fetchNeighborhoods = async (): Promise<FeatureCollection> => {
  try {
    const response = await axios.get<FeatureCollection>(`${API_BASE_URL}/neighborhoods`);
    return response.data;
  } catch (error) {
    console.error('Error fetching neighborhood data:', error);
    throw error;
  }
};

export const fetchPoints = async (): Promise<FeatureCollection> => {
  try {
    const response = await axios.get<FeatureCollection>(`${API_BASE_URL}/homicides`);
    return response.data;
  } catch (error) {
    console.error('Error fetching point data:', error);
    throw error;
  }
};


