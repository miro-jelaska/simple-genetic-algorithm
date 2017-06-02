const config = require('./config');
const geneticAlgorithm = require('./geneticAlgorithm');

function MetaPopulation(generationNumber){
    this.generationNumber = generationNumber;
    this.allGenomes = []
}

MetaPopulation.prototype.addGenome = function(genome){
    this.allGenomes.push({
        value: genome,
        fitnessScore: geneticAlgorithm.calculateFitness(genome) 
    });
}

MetaPopulation.prototype.fitness = function(genome){
    return this.allGenomes.reduce(function(acc, metaGenome) {
        return acc + metaGenome.fitnessScore
    }, 0)
}

MetaPopulation.prototype.getFirstEliteMetaGenome = function(){
    return this.allGenomes.sort((a,b) => b.fitnessScore - a.fitnessScore)[0];
}

MetaPopulation.prototype.size = function(){
    return this.allGenomes.length;
}

MetaPopulation.prototype.containsTargetGenome = function(){
    return this.allGenomes.some(genome => genome.value === config.target);
}


// Static method
MetaPopulation.generateRandom = function (){
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

    let population = new MetaPopulation(1);
    Array
    .from(Array(config.populationSize), 
           (_, index) => generateRandomGenome()
    ).forEach(genome => population.addGenome(genome));

    return population;
}

module.exports = MetaPopulation;