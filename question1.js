const prompt = require('prompt-sync')();
class Animal {
  constructor(name, lifeExpectancy) {
    this.name = name;
    this.lifeExpectancy = lifeExpectancy;
  }
}

class Zoo {
  constructor() {
    this.animals = [];
  }

  inputAnimals() {
    const numberOfAnimals = parseInt(prompt("Enter the number of animals:"));

    for (let i = 0; i < numberOfAnimals; i++) {
      const name = prompt(`Enter the name of animal ${i + 1}:`);
      const lifeExpectancy = parseInt(prompt(`Enter the life expectancy of ${name}:`));
      const animal = new Animal(name, lifeExpectancy);
      this.animals.push(animal);
    }
  }

  getAnimalsAliveAfterYears(n) {
    let aliveCount = 0;
    for (let i = 0; i < this.animals.length; i++) {
      const animal = this.animals[i];
      const remainingYears = animal.lifeExpectancy - n;
      if (remainingYears > 0) {
        aliveCount++;
      }
    }
    return aliveCount;
  }
}

function main() {
  const zoo = new Zoo();

  zoo.inputAnimals();

  const years = parseInt(prompt("Enter the number of years:"));
  const animalsAlive = zoo.getAnimalsAliveAfterYears(years);
  console.log(`Number of animals alive after ${years} years: ${animalsAlive}`);
}

main();
