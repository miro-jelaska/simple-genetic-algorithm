const target ='cilj je kolegija nauciti studente osnovna znanja iz podrucja racunalne inteligencije'
const config = {
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

module.exports = config;