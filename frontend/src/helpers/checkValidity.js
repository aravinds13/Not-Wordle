import axios from "axios";
import config from './config'

const {API_BASE_URI, BACKEND_PORT} = config;

const checkValidity = async (word) => {
    try {
      const response = await axios.get(`/api/checkValidity`, {
        params: {
          guessedWord: word
        }
      });
  
      return response.data || {};
    } catch (err) {
      console.error("Error checking validity:", err);
      return { isValid: false };
    }
  };

export default checkValidity;
