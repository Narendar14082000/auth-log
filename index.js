const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(bodyParser.json());

// Define Routes
app.use('/user', require('./routes/authRoutes'));

const PORT = 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
