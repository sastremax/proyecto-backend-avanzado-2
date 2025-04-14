import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 8084,
    secret_key: process.env.SECRET_KEY,
    jwt_secret: process.env.JWT_SECRET,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    mongo_uri: process.env.MONGO_URI
};

export default config;
