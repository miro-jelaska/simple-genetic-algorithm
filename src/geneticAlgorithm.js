const config = require('./config')

geneticAlgorithm = {
    transformMetaPopulationIntoMatingPool: function(metaPopulation, populationFitness){
        let matingPool = [];
        for(let metaMemberIndex = 0; metaMemberIndex < metaPopulation.length; metaMemberIndex++){
            let metaMember = metaPopulation[metaMemberIndex];
            for(let i = 0; i < Math.round(metaMember.fitnessScore / populationFitness * 100); i++){         
                matingPool.push(metaMember.genome)
            }
        }
        return matingPool;
    },

    crossover: function(firstParent, secondParent, eliteParent){
        let genomeLength = config.target.length;
        let midpointIndex = Math.floor(Math.random()* genomeLength)
        let ab = eliteParent.genome.substring(0, midpointIndex) + secondParent.substring(midpointIndex, genomeLength)
        let ba = secondParent.substring(0, midpointIndex) + eliteParent.genome.substring(midpointIndex, genomeLength)
        return (Math.random() > 0.5 ? ab : ba)
    },

    mutate: function (genome){
        for(let geneIndex = 0; geneIndex < config.target.length; geneIndex++){
            let isGoingToMutate = Math.random() <= config.mutationRate;
            if(isGoingToMutate){
                let mutationGeneExpression = config.genes[Math.floor(Math.random() * config.genes.length)]
                genome = genome.replaceAt(geneIndex, mutationGeneExpression)
            }
        }
        return genome
    }
}

module.exports = geneticAlgorithm