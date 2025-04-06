const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Story = require('./models/story');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB for seeding');
    seedDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));

async function seedDatabase() {
  try {
    const stories = Array.from({ length: 50 }, (_, i) => ({
      name: `Member ${i+1}`,
      gmail: `member${i+1}@gmail.com`,
      successStory: `This is the success story of Member ${i+1}.`,
      image: i === 0 ? 'img1.jpg' : `img${i+1}.jpg`
    }));

    await Story.deleteMany();
    await Story.insertMany(stories);
    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}