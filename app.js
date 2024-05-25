// Importing required dependencies
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

// Creating an Express application instance
const app = express();

// Loading environment variables from .env file
dotenv.config();

// Adding middleware for handling CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);

// Adding middleware for logging HTTP requests
app.use(logger("dev"));

// Adding middleware for parsing JSON bodies
app.use(express.json());

// Adding middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Adding middleware for parsing cookies
app.use(cookieParser());

// Serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Mounting routes for API version 1
app.use("/api/v1", require("./src/v1/routes"));

module.exports = app;
