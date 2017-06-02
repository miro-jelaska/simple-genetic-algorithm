const chalk = require('chalk');
const config = require('./config');

function Display(exactGeneMatch_fitness, calculateFitness){
    this.exactGeneMatch_fitness = exactGeneMatch_fitness;
    this.calculateFitness = calculateFitness;
}
Display.prototype.prettyPrintGenome = function(genome){
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
    let exactGeneMatchScore = this.exactGeneMatch_fitness(genome);
    genomeText = genomeText + ' | ' + chalk.red(exactGeneMatchScore) + ' => ' + this.calculateFitness(genome);
    console.log(genomeText);
}

Display.prototype.prettyPrintMetaPopulation = function(metaPopulation, populationFitness, generationNumber){
    if(generationNumber)
        console.log(chalk.dim.bold('#' + generationNumber + ' generation'));
    console.log(chalk.italic(config.target) + chalk.dim(' ← target'));
    metaPopulation = metaPopulation.sort((a,b)=> b.fitnessScore - a.fitnessScore);
    for(let index = 0; index < metaPopulation.length; index++)
        this.prettyPrintGenome(metaPopulation[index].genome);
    console.log('Σ Fitness: ' + chalk.bold(populationFitness) + '\n');
}

module.exports = Display;