module.exports = function(game) {

  var counter = 0;

  var particleCounter = 0;

  var nextEnemy = 0;
  var initialInterval = 1000;
  var enemyInterval = 1000;
  var decayRate = -0.05;
  var freqIncrease = Math.PI/ 50;
  var increase = Math.PI / 50;
  var freq = 50
  var timePlayed = 1001;

  var enemyIntervalMin = 30

  var mode = 0;

  var aperture = 10;
  var apertureDecayRate = -0.1;
  var apertureFactor = 10;

  return  {

    height: 100,
    width: 100,

    marginTop: 200,
    marginBottom: 200,

    setup: function(canvas, game) {
      this.height = canvas.height;
      this.width = canvas.width;
      this.game = game;
      this.debug = document.getElementsByTagName('p')[0]
    },

    mode: function(_) {
      if (!arguments.length)
        return mode
      mode = _
      return this
    },

    step : function(timestamp) {

      this.stepMargins();

      
      
      counter += freqIncrease;
      
      var xPos = this.width + 20;
      // console.log(yPos);

      if (nextEnemy <= timestamp) {

        if (timePlayed < 100 ) {
          mode = 0
        } else if (timePlayed < 1000) {
          mode = 1
        } else if (timePlayed < 2000) {
          mode = 2
        } else if (timePlayed < 3000) {
          mode = 3
        } else if (timePlayed < 4000) {
          mode = 4
        }
        

        var yPos = this.calculateY();

        
        this.debug.innerHTML = 'freqInc: ' + freqIncrease +
           '<br>apertureFactor: ' + apertureFactor +
           '<br>counter: ' + counter +
           '<br>enemyInterval: ' + enemyInterval +
           '<br>mode: ' + mode +
           '<br>timePlayed: ' + timePlayed

        this.spawnEnemy(xPos, yPos)
        nextEnemy = timestamp + enemyInterval;
        timePlayed++;
        
        enemyInterval = enemyIntervalMin + (initialInterval * Math.exp(decayRate * timePlayed))
        
          
        

        // console.log(enemyInterval, timePlayed);

      } 

    },

    stepMargins : function() {
      if (this.marginTop > 0)
        this.marginTop += Math.cos(counter)

      if (this.marginBottom > 0)
        this.marginBottom += Math.cos(counter)
      
    },

    calculateY : function () {

      // console.log(apertureFactor)

      

      switch (mode) {
        case 0:
          apertureFactor = 2 + (aperture * Math.exp(apertureDecayRate * timePlayed))
          return (this.height/2) + Math.cos(counter) * (this.height/apertureFactor);
        case 1: 
          enemyIntervalMin = 10
          freqIncrease = Math.PI / 40;
          apertureFactor = 2 + (Math.log(timePlayed))
          return (this.height/2) + (Math.cos(counter) * this.height/2) + (Math.sin(counter) * (this.height/apertureFactor));
        case 2:
          enemyIntervalMin = 20
          freqIncrease = Math.PI / 20;
          apertureFactor = 2 + (Math.log(timePlayed))
          return  (this.height/2) + (Math.sin(counter) * this.height/2) + (Math.sin(counter) * (this.height/apertureFactor));
        case 3: 
          enemyIntervalMin = 30
          freqIncrease = Math.PI / 500;
          increase = Math.PI / 50;
          apertureFactor = 8 * Math.random()
          return (this.height/2)  + (Math.sin(counter) * this.height/2)
        case 4: 
          enemyIntervalMin = 30
          freqIncrease = Math.PI / 400;
          increase = Math.PI / 10;
          return (this.height/2)  + (Math.cos(counter) * this.height/2)
          // return  Math.random() * (100) - (Math.tan(counter) * this.height/2) + (Math.sin(counter) * (this.height/apertureFactor));
      }


    },

    calculateDir : function () {

      particleCounter += increase;

      switch (mode) {
        case 0:
          return {x: -1, y: 0}
        case 1: 
          return {x: -1.1, y: 0}
        case 2:
          return {x: -0.4, y: 0.5 - Math.random()}
        case 3:
          return {x: -1.2, y: (Math.cos(particleCounter))}        
        case 4:
          return {x: -2, y: (Math.sin(particleCounter))}

      }

    },


    spawnEnemy : function (xPos, yPos) {

      var enemy = this.game.spawnEntity('enemy');
      enemy.init(xPos, yPos , {
          dir : this.calculateDir()
      })

    }

  }

}