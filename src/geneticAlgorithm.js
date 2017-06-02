require('./String.prototype.replaceAt')
const config = require('./config')

geneticAlgorithm = (function(){
    function transformMetaPopulationIntoMatingPool (metaPopulation, populationFitness){
        let matingPool = [];
        for(let metaMemberIndex = 0; metaMemberIndex < metaPopulation.allGenomes.length; metaMemberIndex++){
            let metaMember = metaPopulation.allGenomes[metaMemberIndex];
            let numberOfInstances = Math.round(metaMember.fitnessScore / 1.0 / populationFitness * 100);
            for(let currentInstance = 0; currentInstance < numberOfInstances; currentInstance++){  
                matingPool.push(metaMember.value)
            }
        }
        return matingPool;
    }

    function crossover(firstParentGenome, secondParentGenome){
        let genomeLength = config.target.length;
        let midpointIndex = Math.floor(Math.random() * genomeLength)

        let ab = firstParentGenome.substring(0, midpointIndex) + secondParentGenome.substring(midpointIndex, genomeLength)
        let ba = secondParentGenome.substring(0, midpointIndex) + firstParentGenome.substring(midpointIndex, genomeLength)

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

    function exactGeneMatchFitness(genome){
        let numberExactGeneMatch = 0
        for(let geneIndex = 0; geneIndex < config.target.length; geneIndex++){
            let isExactMatch = config.target[geneIndex] === genome[geneIndex]
            numberExactGeneMatch = numberExactGeneMatch + config.fitnessPoints.exactGeneMatch * (isExactMatch ? 1 : 0)
        }
        return numberExactGeneMatch
    }

    function calculateFitness(genome){
        return Math.pow(exactGeneMatchFitness(genome), 2)
    }

    return {
        transformMetaPopulationIntoMatingPool: transformMetaPopulationIntoMatingPool,
        crossover: crossover,
        mutate: mutate,
        exactGeneMatchFitness: exactGeneMatchFitness,
        calculateFitness: calculateFitness
    }
})();

module.exports = geneticAlgorithm