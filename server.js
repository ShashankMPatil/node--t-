const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create User schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Create User model
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route for user sign-up
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Create a new user instance
  const newUser = new User({
    email,
    password,
  });

  // Save the user to the database
  newUser.save((err) => {
    if (err) {
      res.status(500).send('Error signing up');
    } else {
      res.status(200).send('Successfully signed up');
    }
  });
});

// Route for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user in the database
  User.findOne({ email, password }, (err, user) => {
    if (err) {
      res.status(500).send('Error logging in');
    } else {
      if (user) {
        res.status(200).send('Successfully logged in');
      } else {
        res.status(401).send('Invalid credentials');
      }
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});