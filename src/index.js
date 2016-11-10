export default class {
  constructor(
    mutationFunction = (phenotype) => phenotype,
    crossoverFunction = (a, b) => [a, b],
    fitnessFunction = (phenotype) => 0 ,
    isABetterThanBFunction = undefined,
    population = [],
    populationSize = 100){

      this.mutationFunction = mutationFunction;
      this.crossoverFunction = crossoverFunction;
      this.fitnessFunction = fitnessFunction;
      this.isABetterThanBFunction = isABetterThanBFunction;
      this.population = population;
      this.populationSize = 100;
      this.chanceOfMutation = 50;
  }

  populate () {
      var size = this.population.length;
      while( this.population.length < this.populationSize ) {
          this.population.push(
              this.mutate(
                  this.population[ Math.floor( Math.random() * size ) ]
              )
          );
      }
  }

  mutate(phenotype) {
    return this.mutationFunction(phenotype);
  }

  crossover(phenotype) {
    var randomIndex = Math.floor(Math.random() * this.population.length);
    var matePhenotype = this.population[randomIndex];
    return this.crossoverFunction(phenotype, matePhenotype)[0];
  }

  isABetterThanB(a,b) {
    var isABetterThanB = false;
    if ( this.isABetterThanBFunction ) {
        return this.isABetterThanBFunction(a, b);
    }
    return this.fitnessFunction(a) >= this.fitnessFunction(b);
  }

  compete() {
      var nextGeneration = [];

      for( var p = 0 ; p < this.population.length - 1 ; p+=2 ) {
          var phenotype = this.population[p];
          var competitor = this.population[p+1];

          if ( this.isABetterThanB( phenotype , competitor )) {
              if ( Math.random() < this.chanceOfMutation / 100 ) {
                  nextGeneration.push(this.mutate(phenotype));
              } else {
                  nextGeneration.push(this.crossover(phenotype));
              }
          } else {
              nextGeneration.push(competitor);
          }
      }

      this.population = nextGeneration;
  }

  mixPopulationOrder() {

      for( var index = 0 ; index < this.population.length ; index++ ) {
          var newIndex = Math.floor( Math.random() * this.population.length );
          var tempPhenotype = this.population[newIndex];
          this.population[newIndex] = this.population[index];
          this.population[index] = tempPhenotype;
      }
  }

  evolve() {
    this.populate();
    this.mixPopulationOrder();
    this.compete();
  }

  best() {
    var myFitnessFunction = this.fitnessFunction;
    var theBest = this.population.reduce(function(previousPhenotype, currentPhenotype) {
       var previousFitness = myFitnessFunction(previousPhenotype);
       var currentFitness = myFitnessFunction(currentPhenotype);
       return previousFitness >= currentFitness ? previousPhenotype : currentPhenotype;
    });

    return theBest;
  }
}