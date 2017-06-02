const chalk = require('chalk');
const Utility = require('./utility');
const display = require('./display');
const readlineSync = require('readline-sync');
const geneticAlgorithm = require('./geneticAlgorithm');
const config = require('./config')
const MetaPopulation = require('./metaPopulation')

function nextGeneration(metaPopulation){
    let nextGeneration = new MetaPopulation(population.generationNumber + 1)
    let matingPool = geneticAlgorithm.transformMetaPopulationIntoMatingPool(population, population.fitness())
    for(let _index = 0; _index < config.populationSize; _index++){
        let firstParent;
        if(config.elitismEnabled)
            firstParent = population.getFirstEliteMetaGenome().value;
        else
            firstParent = matingPool[Math.floor(Math.random() * matingPool.length)]
        
        let secondParent;
        do {
            secondParent = matingPool[Math.floor(Math.random() * matingPool.length)]
        } while(secondParent === firstParent)

        let child = 
            geneticAlgorithm.mutate(
                geneticAlgorithm.crossover(firstParent, secondParent))
                
        nextGeneration.addGenome(child);
    }
    return nextGeneration;
}

let population;
for(population = MetaPopulation.generateRandom();
    !population.containsTargetGenome();
    population = nextGeneration(population)) {
    if(config.verbose && population.generationNumber % config.printEveryNthGeneration === 0)
        display.prettyPrintMetaPopulation(population)
}

console.log(chalk.bgWhite.black('Success! Generation #' + population.generationNumber))