const chalk = require('chalk');
const config = require('./config');
const geneticAlgorithm = require('./geneticAlgorithm');

const display = (function(){

    function prettyPrintGenome(genome){
        let genomeText = '';
        for(let geneIndex = 0; geneIndex < config.target.length; geneIndex++){
            let gene = genome[geneIndex];
            if(config.target[geneIndex] === gene)
                genomeText = genomeText + chalk.white.bgRed(gene);
            else if(config.uniqGenesInTarget.some(targetGene => targetGene === gene))
                genomeText = genomeText + chalk.gray.bgYellow(gene);
            else
                genomeText = genomeText + gene;
        }
        let exactGeneMatchScore = geneticAlgorithm.exactGeneMatchFitness(genome);
        genomeText = genomeText + ' | ' + chalk.red(exactGeneMatchScore) + ' ⇒ ' + geneticAlgorithm.calculateFitness(genome);
        console.log(genomeText);
    }

    function prettyPrintMetaPopulation(metaPopulation){
        if(metaPopulation.generationNumber)
            console.log(chalk.dim.bold('#' + metaPopulation.generationNumber + ' generation'));
        console.log(chalk.italic(config.target + ' ← target'));
        metaPopulation.allGenomes = metaPopulation.allGenomes.sort((a,b) => b.fitnessScore - a.fitnessScore);
        for(let index = 0; index < metaPopulation.size(); index++)
            prettyPrintGenome(metaPopulation.allGenomes[index].value);
        console.log('Σ Fitness: ' + chalk.bold(metaPopulation.fitness()) + '\n');
    }

    return {
        prettyPrintMetaPopulation: prettyPrintMetaPopulation
    }
})();

module.exports = display;