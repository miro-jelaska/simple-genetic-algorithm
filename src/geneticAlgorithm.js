const config = require('./config')

geneticAlgorithm = (function(){

    function transformMetaPopulationIntoMatingPool (metaPopulation, populationFitness){
        let matingPool = [];
        for(let metaMemberIndex = 0; metaMemberIndex < metaPopulation.length; metaMemberIndex++){
            let metaMember = metaPopulation[metaMemberIndex];
            for(let i = 0; i < Math.round(metaMember.fitnessScore / populationFitness * 100); i++){         
                matingPool.push(metaMember.genome)
            }
        }
        return matingPool;
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
    function exactGeneMatchFitness(genome){
        // Count presence of one gene for each location
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