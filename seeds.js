const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Story = require('./models/story');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const stories = [];

for (let i = 1; i <= 50; i++) {
  stories.push({
    name: `Member ${i}`,
    gmail: `member${i}@gmail.com`,
    successStory: `This is the success story of Member ${i}.`,
    image: i === 1 ? 'img1.jpg' : `img${i}.jpg`
  });
}

Story.insertMany(stories)
  .then(() => {
    console.log('Data seeded successfully');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error seeding data:', err));
