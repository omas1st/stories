const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Regular routes
const storiesRoute = require('./routes/stories');
app.use('/stories', storiesRoute);

// Admin routes
const adminRoute = require('./routes/admin');
app.use('/admin', adminRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
