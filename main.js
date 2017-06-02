const chalk = require('chalk');
const Utility = require('./utility');
const Display = require('./display');
const readlineSync = require('readline-sync');
const geneticAlgorithm = require('./geneticAlgorithm');

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

console.log(Display)

let target ='cilj je kolegija nauciti studente osnovna znanja iz podrucja racunalne inteligencije'
let config = {
    verbose: true,
    printEveryNthGeneration: 100,
    genes: 'abcdefghijklmnopqrstuvwxyz,. ()'.split(''),
    target: target,
    uniqGenesInTarget: Utility.uniqArray(target),
    populationSize: 25,
    mutationRate: 1/target.length,
    fitnessPoints: {
        geneExists: 0,
        exactGeneMatch: 1
    }
}



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

const display = new Display(config, exactGeneMatch_fitness, calculateFitness);

function getEliteMetaParent(metaPopulation){
    return metaPopulation.sort((a,b)=> b.fitnessScore - a.fitnessScore)[0];
}

function crossover(firstParent, secondParent, eliteParent){
    let genomeLength = config.target.length;
    let midpointIndex = Math.floor(Math.random()* genomeLength)
    let ab = eliteParent.genome.substring(0, midpointIndex) + secondParent.substring(midpointIndex, genomeLength)
    let ba = secondParent.substring(0, midpointIndex) + eliteParent.genome.substring(midpointIndex, genomeLength)
    return (Math.random() > 0.5 ? ab : ba)
}
function mutate(genome){
    for(let geneIndex = 0; geneIndex < config.target.length; geneIndex++){
        let isGoingToMutate = Math.random() <= config.mutationRate;
        if(isGoingToMutate){
            let mutationGeneExpression = config.genes[Math.floor(Math.random() * config.genes.length)]
            genome = genome.replaceAt(geneIndex, mutationGeneExpression)
        }
    }
    return genome
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

    metaPopulation = metaPopulation.map(metaGenome => {
        metaGenome.fitnessRate = metaGenome.fitnessScore / populationFitness
        return metaGenome
    })

    if(config.verbose && generationNumber % config.printEveryNthGeneration === 0)
        display.prettyPrintMetaPopulation(metaPopulation, populationFitness, generationNumber)


    let matingPool = geneticAlgorithm.transformMetaPopulationIntoMatingPool(metaPopulation)
    let eliteParent = getEliteMetaParent(metaPopulation)
    let nextGeneration = []
    for(let i = 0; i < config.populationSize; i++){
        let firstParent = matingPool[Math.floor(Math.random() * matingPool.length)]
        
        let secondParent = matingPool[Math.floor(Math.random() * matingPool.length)]
        while(firstParent === secondParent){
            secondParent = matingPool[Math.floor(Math.random() * matingPool.length)]
        }
        let child = crossover(firstParent, secondParent, eliteParent)
        nextGeneration.push(child);
    }

    population = nextGeneration.map(gene => mutate(gene))   
    generationNumber++
}
console.log('Success! generation #' + generationNumber)