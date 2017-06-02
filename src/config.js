const target ='to be or not to be'
const config = {
    verbose: true,
    printEveryNthGeneration: 100,
    genes: 'abcdefghijklmnopqrstuvwxyz,. ()'.split(''),
    target: target,
    uniqGenesInTarget: Utility.uniqArray(target),
    populationSize: 20,
    mutationRate: 1/target.length,
    fitnessPoints: {
        geneExists: 0,
        exactGeneMatch: 1
    },
    elitismEnabled: true
}

module.exports = config;