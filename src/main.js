const chalk = require('chalk');
const Utility = require('./utility');
const Display = require('./display');
const readlineSync = require('readline-sync');
const geneticAlgorithm = require('./geneticAlgorithm');
const config = require('./config')

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

console.log(Display)





function generateInitialPopulation(){
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function generateRandomGenome(){
        return Array
            .from(Array(config.target.length), (_, index) => getRandomInt(0, config.genes.length))
            .map(index => config.genes[index])
            .join('')
    }

    return Array.from(Array(config.populationSize), (_, index) => generateRandomGenome());
}

function exactGeneMatch_fitness(genome){
    // Count presence of one gene for each location
    let numberExactGeneMatch = 0
    for(let geneIndex = 0; geneIndex < config.target.length; geneIndex++){
        let isExactMatch = config.target[geneIndex] === genome[geneIndex]
        numberExactGeneMatch = numberExactGeneMatch + config.fitnessPoints.exactGeneMatch * (isExactMatch ? 1 : 0)
    }
    return numberExactGeneMatch
}


function calculateFitness(genome){
    return Math.pow(exactGeneMatch_fitness(genome), 2)
}

const display = new Display(exactGeneMatch_fitness, calculateFitness);

function getEliteMetaParent(metaPopulation){
    return metaPopulation.sort((a,b) => b.fitnessScore - a.fitnessScore)[0];
}


let population = generateInitialPopulation();
let metaPopulation;
let populationFitness
let generationNumber = 1;
while(!population.some(genome => genome === config.target)){
    metaPopulation = population.map(genome => {
        return {
            genome: genome,
            fitnessScore: calculateFitness(genome) 
        }
    })
    populationFitness = metaPopulation.reduce(function(acc, metaGenome) {
    return acc + metaGenome.fitnessScore
    }, 0)

    if(config.verbose && generationNumber % config.printEveryNthGeneration === 0)
        display.prettyPrintMetaPopulation(metaPopulation, populationFitness, generationNumber)

    let matingPool = geneticAlgorithm.transformMetaPopulationIntoMatingPool(metaPopulation, populationFitness)
    let eliteParent = getEliteMetaParent(metaPopulation)
    let nextGeneration = []
    for(let i = 0; i < config.populationSize; i++){
        let firstParent = matingPool[Math.floor(Math.random() * matingPool.length)]
        
        let secondParent = matingPool[Math.floor(Math.random() * matingPool.length)]
        while(firstParent === secondParent){
            secondParent = matingPool[Math.floor(Math.random() * matingPool.length)]
        }
        let child = geneticAlgorithm.crossover(firstParent, secondParent, eliteParent)
        nextGeneration.push(child);
    }

    population = nextGeneration.map(gene => geneticAlgorithm.mutate(gene))   
    generationNumber++
}
console.log('Success! generation #' + generationNumber)