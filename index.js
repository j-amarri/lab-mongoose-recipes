const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    return self.connection.dropDatabase();
  })
  .then(recipe => {
    return Recipe.create({
      title: 'Lasagne',
      level: 'Amateur Chef',
      ingredients: [
        'Passata',
        'Parmigiano',
        'Ragu',
        'Besciamella',
        'Pasta fresca'
      ],
      cuisine: 'Italian',
      dishType: 'main_course',
      duration: 150,
      creator: 'Jamies',
      created: Date.now()
    });
  })
  .then(recipe => {
    console.log(recipe.title);
    return Recipe.insertMany(data);
  })
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].title);
    }
    return Recipe.findOneAndUpdate(
      { title: 'Rigatoni alla Genovese' },
      { duration: 100 },
      { new: true }
    );
  })
  .then(data => {
    console.log('Duration was updated with success: ', data.duration);
    Recipe.deleteOne({ title: 'Carrot Cake' });
  })
  .then(data => {
    console.log('Carrot Cake was deleted');
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('Disconnected from Mongo DB!');
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });
