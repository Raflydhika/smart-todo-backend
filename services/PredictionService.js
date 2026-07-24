import axios from 'axios';
import ML_API_URL from '../config/ml.js';

const predictTaskDuration = async (difficulty, userEstimatedTime = null) => {
  try {
    const response = await axios.post(
      `${ML_API_URL}/predict`,
      {
        difficulty,
        user_estimated_time: userEstimatedTime,
      },
      {
        timeout: 10000, // maksimal menunggu 10 detik
      },
    );

    return response.data;
  } catch (error) {
    console.error('ML API Error:', error.response?.data || error.message);

    throw {
      status: 500,
      message: 'Machine Learning Service tidak dapat dihubungi.',
    };
  }
};

export default {
  predictTaskDuration,
};
