const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');

const app = express();


var corsOptions = {
  origin: "http://localhost:8080"
};
app.use(cors(corsOptions));

// ping route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Backend API BlueBerry." });
});

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json());

app.use(reviewRoutes);
app.use(authRoutes);


module.exports = app ;