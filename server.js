const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the public folder
app.use(express.static('public'));

// Parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware with connect-mongo
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60 // Session expiration in seconds (14 days)
  })
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Redirect root to /stories
app.get('/', (req, res) => {
  res.redirect('/stories');
});

// Routes
const storiesRoute = require('./routes/stories');
app.use('/stories', storiesRoute);

const adminRoute = require('./routes/admin');
app.use('/admin', adminRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
