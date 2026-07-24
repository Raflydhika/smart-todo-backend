import dotenv from 'dotenv';

dotenv.config();

const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

export default ML_API_URL;
