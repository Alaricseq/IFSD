const mongoose = require('mongoose');

// Connection URL and database name
const uri = 'mongodb+srv://alaricsbsc22:kingkong123A@cluster0.hlxslgt.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'animals';

// Create a Mongoose schema for the Animal entity
const animalSchema = new mongoose.Schema({
  name: String,
  lifeExpectancy: Number
});

// Create a Mongoose model for the Animal entity
const AnimalModel = mongoose.model('Animal', animalSchema);

class AnimalCollection {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName });
      this.connection = mongoose.connection;
      console.log('Connected to MongoDB successfully');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw err;
    }
  }

  async createAnimal(name, lifeExpectancy) {
    try {
      const animal = new AnimalModel({ name, lifeExpectancy });
      const savedAnimal = await animal.save();
      console.log('Animal created:', savedAnimal._id);
      return savedAnimal._id;
    } catch (err) {
      console.error('Error creating animal:', err);
      throw err;
    }
  }

  async readAnimals() {
    try {
      const animals = await AnimalModel.find();
      console.log('Animals found:', animals);
      return animals;
    } catch (err) {
      console.error('Error reading animals:', err);
      throw err;
    }
  }

  async updateAnimal(animalId, update) {
    try {
      const result = await AnimalModel.updateOne({ _id: animalId }, update);
      console.log('Animal updated:', result.nModified);
      return result.nModified;
    } catch (err) {
      console.error('Error updating animal:', err);
      throw err;
    }
  }

  async deleteAnimal(animalId) {
    try {
      const result = await AnimalModel.deleteOne({ _id: animalId });
      console.log('Animal deleted:', result.deletedCount);
      return result.deletedCount;
    } catch (err) {
      console.error('Error deleting animal:', err);
      throw err;
    }
  }
}

async function main() {
  const collection = new AnimalCollection();

  await collection.connect();

  const animalsData = [
    { name: 'Lion', lifeExpectancy: 15 },
    { name: 'Elephant', lifeExpectancy: 60 },
    { name: 'Tiger', lifeExpectancy: 12 }
  ];

  for (const animalData of animalsData) {
    const { name, lifeExpectancy } = animalData;
    await collection.createAnimal(name, lifeExpectancy);
    console.log(`Added ${name} to the collection.`);
  }

  // Read animals
  const animals = await collection.readAnimals();
  console.log('Animals in the collection:', animals);

  // Update an animal
  const animalToUpdate = animals[0]; // Choose an animal to update (e.g., the first one)
  const newLifeExpectancy = 20; // Specify the new life expectancy
  const update = { $set: { lifeExpectancy: newLifeExpectancy } };
  const updatedCount = await collection.updateAnimal(animalToUpdate._id, update);
  console.log('Number of animals updated:', updatedCount);

  // Delete an animal
  const animalToDelete = animals[1]; // Choose an animal to delete (e.g., the second one)
  const deletedCount = await collection.deleteAnimal(animalToDelete._id);
  console.log('Number of animals deleted:', deletedCount);

  // Read animals after update and delete
  const updatedAnimals = await collection.readAnimals();
  console.log('Animals in the collection after update and delete:', updatedAnimals);
}

main().catch((err) => {
  console.error('An error occurred:', err);
});
