const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  name: String,
  gmail: String,
  successStory: String,
  image: { type: String, default: 'img1.jpg' } // default image for the first person; you can update as needed
});

module.exports = mongoose.model('Story', StorySchema);
