const express = require('express');
const router = express.Router();
const Story = require('../models/story');

// Middleware to check if admin is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect('/admin/login');
  }
}

// GET /admin/login: Display login form
router.get('/login', (req, res) => {
  res.render('admin_login', { error: null });
});

// POST /admin/login: Process login form
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    req.session.user = username;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin_login', { error: 'Invalid credentials' });
  }
});

// GET /admin/dashboard: Admin dashboard with list of stories
router.get('/dashboard', isAuthenticated, async (req, res) => {
  const stories = await Story.find();
  res.render('admin_dashboard', { stories, session: req.session });
});

// GET /admin/add: Display form to add a new story
router.get('/add', isAuthenticated, (req, res) => {
  res.render('admin_add');
});

// POST /admin/add: Process new story form submission
router.post('/add', isAuthenticated, async (req, res) => {
  const { name, gmail, successStory, image } = req.body;
  const newStory = new Story({
    name,
    gmail,
    successStory,
    image: image || 'img1.jpg'
  });
  await newStory.save();
  res.redirect('/admin/dashboard');
});

// GET /admin/logout: Log out the admin
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

module.exports = router;
