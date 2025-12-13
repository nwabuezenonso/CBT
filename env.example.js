// This file is an example of the environment variables required for the application.
// Rename correct keys to .env file in the root directory.

module.exports = {
  // MongoDB Connection String
  MONGODB_URI: "mongodb://localhost:27017/your_database_name",

  // JWT Secret for authentication
  JWT_SECRET: "your_jwt_secret_key_here",

  // Environment mode (development/production)
  NODE_ENV: "development"
};
