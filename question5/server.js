const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

// MongoDB connection string
const uri =
  'mongodb+srv://alaricsbsc22:kingkong123A@cluster0.hlxslgt.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');

  const db = client.db('animal_collection'); // Specify the database name
  const animalsCollection = db.collection('animals'); // Specify the collection name

  // Express routes
  app.use(express.json());

  // Fetch all animals
  app.get('/animals', (req, res) => {
    animalsCollection
      .find({})
      .toArray()
      .then((animals) => {
        res.json(animals);
      })
      .catch((error) => {
        console.error('Error retrieving animals:', error);
        res.status(500).json({ error: 'Error retrieving animals' });
      });
  });

  // Create an animal
  app.post('/animals', (req, res) => {
    const newAnimal = req.body;
    console.log('New animal:', newAnimal);
    animalsCollection
      .insertOne(newAnimal)
      .then((result) => {
        console.log('Insert result:', result);
        const insertedId = result.insertedId;
        animalsCollection
          .findOne({ _id: insertedId })
          .then((createdAnimal) => {
            console.log('Inserted animal:', createdAnimal);
            if (createdAnimal) {
              res.status(201).json(createdAnimal);
            } else {
              res.status(500).json({ error: 'Error creating animal' });
            }
          })
          .catch((error) => {
            console.error('Error retrieving inserted animal:', error);
            res.status(500).json({ error: 'Error creating animal' });
          });
      })
      .catch((error) => {
        console.error('Error creating animal:', error);
        res.status(500).json({ error: 'Error creating animal' });
      });
  });

  // Update an animal
  app.put('/animals/:id', (req, res) => {
    const id = req.params.id;
    const updatedAnimal = req.body;
    animalsCollection
      .updateOne({ _id: ObjectId(id) }, { $set: updatedAnimal })
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error('Error updating animal:', error);
        res.status(500).json({ error: 'Error updating animal' });
      });
  });

  // Delete an animal
  app.delete('/animals/:id', (req, res) => {
    const id = req.params.id;
    animalsCollection
      .deleteOne({ _id: ObjectId(id) })
      .then(() => {
        res.sendStatus(204);
      })
      .catch((error) => {
        console.error('Error deleting animal:', error);
        res.status(500).json({ error: 'Error deleting animal' });
      });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
