const express = require('express');
const router = express.Router();
const Story = require('../models/story');

router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().limit(50);
    res.render('stories', { stories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;