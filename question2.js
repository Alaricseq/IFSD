const { MongoClient, ObjectId } = require('mongodb');

// Connection URL and database name
  const url = 'mongodb+srv://alaricsbsc22:kingkong123A@cluster0.hlxslgt.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'animals';
const collectionName = 'animals';

class Animal {
  constructor(name, species, age) {
    this.name = name;
    this.species = species;
    this.age = age;
  }
}

class AnimalCollection {
  constructor() {
    this.client = new MongoClient(url);
    this.db = null;
    this.collection = null;
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(dbName);
      this.collection = this.db.collection(collectionName);
      console.log('Connected to MongoDB successfully');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw err;
    }
  }

  async createAnimal(name, species, age) {
    const animal = new Animal(name, species, age);

    try {
      const result = await this.collection.insertOne(animal);
      console.log('Animal created:', result.insertedId);
      return result.insertedId;
    } catch (err) {
      console.error('Error creating animal:', err);
      throw err;
    }
  }

  async readAnimals() {
    try {
      const result = await this.collection.find().toArray();
      console.log('Animals found:', result);
      return result;
    } catch (err) {
      console.error('Error reading animals:', err);
      throw err;
    }
  }

  async updateAnimal(animalId, update) {
    try {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(animalId) },
        { $set: update }
      );
      console.log('Animal updated:', result.modifiedCount);
      return result.modifiedCount;
    } catch (err) {
      console.error('Error updating animal:', err);
      throw err;
    }
  }

  async deleteAnimal(animalId) {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(animalId) });
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

  const animalsToAdd = [
    { name: 'Lion', species: 'Panthera leo', age: 5 },
    { name: 'Elephant', species: 'Loxodonta africana', age: 10 },
    { name: 'Tiger', species: 'Panthera tigris', age: 7 }
  ];

  for (const animal of animalsToAdd) {
    await collection.createAnimal(animal.name, animal.species, animal.age);
    console.log(`Added ${animal.name} to the collection.`);
  }

  // Read animals
  const animals = await collection.readAnimals();
  console.log('Initial animal list:', animals);

  // Choose an animal to update (assuming the first animal)
  const animalToUpdate = animals[0];

  // Set the updated age
  const updatedAge = 6;

  // Update the animal
  const updateResult = await collection.updateAnimal(animalToUpdate._id, { age: updatedAge });

  if (updateResult) {
    console.log('Animal age updated successfully.');

    // Read animals again to see the updated data
    const updatedAnimals = await collection.readAnimals();
    console.log('Updated animal list:', updatedAnimals);
  }

  // Choose an animal to delete (assuming the second animal)
  const animalToDelete = animals[1];

  // Delete the animal
  const deleteResult = await collection.deleteAnimal(animalToDelete._id);

  if (deleteResult) {
    console.log('Animal deleted successfully.');

    // Read animals again to see the updated list after deletion
    const remainingAnimals = await collection.readAnimals();
    console.log('Remaining animal list:', remainingAnimals);
  }
}

main().catch((err) => {
  console.error('An error occurred:', err);
});
