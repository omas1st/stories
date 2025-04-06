const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  name: String,
  gmail: String,
  successStory: String,
  image: { type: String, default: 'img1.jpg' }
});

module.exports = mongoose.model('Story', StorySchema);
