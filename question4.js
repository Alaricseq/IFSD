<!DOCTYPE html>
<html>
<head>
  <title>Animal Collection</title>
  <script src="https://unpkg.com/react/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/babel-standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState } = React;

    const AnimalCollection = () => {
      const [animals, setAnimals] = useState([
        { id: 1, name: 'Lion', lifeExpectancy: 15 },
        { id: 2, name: 'Elephant', lifeExpectancy: 60 },
        { id: 3, name: 'Tiger', lifeExpectancy: 12 }
      ]);
      const [newAnimal, setNewAnimal] = useState({
        id: '',
        name: '',
        lifeExpectancy: 0
      });
      const [editingAnimalId, setEditingAnimalId] = useState(null);
      const [yearsToCheck, setYearsToCheck] = useState(0);
      const [aliveCount, setAliveCount] = useState(0);

      const createAnimal = () => {
        // Add the new animal to the list of animals using the spread operator
        setAnimals([...animals, newAnimal]);

        // Reset the newAnimal state to clear the input fields
        setNewAnimal({ id: '', name: '', lifeExpectancy: 0 });
      };

      const deleteAnimal = (id) => {
        // Filter the animals array to remove the animal with the specified ID
        const updatedAnimals = animals.filter((animal) => animal.id !== id);
        setAnimals(updatedAnimals);
      };

      const startEditing = (id) => {
        // Set the ID of the animal being edited
        setEditingAnimalId(id);
      };

      const updateAnimal = (id, updatedAnimal) => {
        // Map over the animals array and update the animal with the specified ID
        const updatedAnimals = animals.map((animal) => {
          if (animal.id === id) {
            return { ...animal, ...updatedAnimal }; // Use the spread operator to merge the updated values
          }
          return animal;
        });
        setAnimals(updatedAnimals);
        setEditingAnimalId(null);
      };

      const getAnimalsAliveAfterYears = (n) => {
        let count = 0;
        for (let i = 0; i < animals.length; i++) {
          const animal = animals[i];
          const remainingYears = animal.lifeExpectancy - n;
          if (remainingYears > 0) {
            count++;
          }
        }
        return count;
      };

      const handleYearsToCheckChange = (e) => {
        // Update the yearsToCheck state based on the input value
        setYearsToCheck(parseInt(e.target.value));
      };

      const handleGetAnimalsAlive = () => {
        // Call the getAnimalsAliveAfterYears function and set the aliveCount state
        const count = getAnimalsAliveAfterYears(yearsToCheck);
        setAliveCount(count);
      };

      return (
        <div>
          <h1>Animal Collection</h1>
          <ol>
            {animals.map((animal) => (
              <li key={animal.id}>
                {editingAnimalId === animal.id ? (
                  <div>
                    <label>
                      Name:
                      <input
                        type="text"
                        value={animal.name}
                        onChange={(e) =>
                          updateAnimal(animal.id, { name: e.target.value })
                        }
                      />
                    </label>
                    <br />
                    <label>
                      Life Expectancy:
                      <input
                        type="number"
                        value={animal.lifeExpectancy}
                        onChange={(e) =>
                          updateAnimal(animal.id, {
                            lifeExpectancy: parseInt(e.target.value)
                          })
                        }
                      />
                    </label>
                    <br />
                  </div>
                ) : (
                  <div>
                    {animal.name} - Life Expectancy: {animal.lifeExpectancy}
                    <button onClick={() => startEditing(animal.id)}>Edit</button>
                    <button onClick={() => deleteAnimal(animal.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ol>
          <h2>Add New Animal</h2>
          <label>
            ID:
            <input
              type="text"
              value={newAnimal.id}
              onChange={(e) => setNewAnimal({ ...newAnimal, id: e.target.value })}
            />
          </label>
          <br />
          <label>
            Name:
            <input
              type="text"
              value={newAnimal.name}
              onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
            />
          </label>
          <br />
          <label>
            Life Expectancy:
            <input
              type="number"
              value={newAnimal.lifeExpectancy}
              onChange={(e) =>
                setNewAnimal({ ...newAnimal, lifeExpectancy: parseInt(e.target.value) })
              }
            />
          </label>
          <br />
          <button onClick={createAnimal}>Add Animal</button>

          <h2>Get Animals Alive After Years</h2>
          <label>
            Years to Check:
            <input
              type="number"
              value={yearsToCheck}
              onChange={handleYearsToCheckChange}
            />
          </label>
          <button onClick={handleGetAnimalsAlive}>Check</button>
          <p>Animals Alive: {aliveCount}</p>
        </div>
      );
    };

    ReactDOM.render(<AnimalCollection />, document.getElementById('root'));
  </script>
</body>
</html>
