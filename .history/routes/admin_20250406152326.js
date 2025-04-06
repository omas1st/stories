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
  try {
    const stories = await Story.find();
    res.render('admin_dashboard', { stories, session: req.session });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /admin/add: Display form to add a new story
router.get('/add', isAuthenticated, (req, res) => {
  res.render('admin_add');
});

// POST /admin/add: Process new story form submission
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const { name, gmail, successStory, image } = req.body;
    const newStory = new Story({
      name,
      gmail,
      successStory,
      image: image || 'img1.jpg'
    });
    await newStory.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding story');
  }
});

// GET /admin/edit/:id: Display form to edit a story
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    res.render('admin_edit', { story });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
});

// POST /admin/edit/:id: Process the edit form submission
router.post('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const { name, gmail, successStory, image } = req.body;
    await Story.findByIdAndUpdate(req.params.id, { name, gmail, successStory, image });
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
});

// GET /admin/delete/:id: Delete a story
router.get('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
});

// GET /admin/logout: Log out the admin
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

module.exports = router;
