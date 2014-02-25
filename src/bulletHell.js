module.exports = function(game) {

  var counter = Math.random() * 10;

  var particleCounter = 0;

  var nextEnemy = 0;
  var initialInterval = 1000;
  var enemyInterval = 1000;
  var decayRate = -0.05;
  var freqIncrease = Math.PI/ 50;
  var increase = Math.PI / 50;
  var freq = 50
  var timePlayed = 0;
  var intervalTime = 0;

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

      timePlayed++;
      
      
      counter += freqIncrease;
      
      var xPos = this.width + 20;
      // console.log(yPos);

      if (nextEnemy <= timestamp) {

       
        mode = Math.min(Math.floor(timePlayed / 1000), 7);

        var yPos = this.calculateY();

        this.debug.innerHTML = 'freqInc: ' + freqIncrease +
           '<br>apertureFactor: ' + apertureFactor +
           '<br>counter: ' + counter +
           '<br>enemyInterval: ' + enemyInterval +
           '<br>mode: ' + mode +
           '<br>timePlayed: ' + timePlayed +
           '<br>entities:' + this.game.entities.length

        var dir = this.calculateDir();

        if (mode == 7) {
          this.spawnEnemy(xPos, (this.height - yPos/3) % this.height, dir)
          this.spawnEnemy(xPos, (this.height - yPos/2) % this.height, dir)
          this.spawnEnemy(xPos, (this.height - yPos) % this.height, dir)
          this.spawnEnemy(xPos, yPos, dir)
          var dir2 = { x: dir.x, y : -dir.y}
          this.spawnEnemy(xPos, (this.height + yPos) % this.height, dir2)
          this.spawnEnemy(xPos, (this.height + yPos/2) % this.height, dir2)
          this.spawnEnemy(xPos, (this.height + yPos/3) % this.height, dir2)
        } else if (mode == 6) {
          this.spawnEnemy(xPos, (this.height - yPos) % this.height, dir)
          this.spawnEnemy(xPos, (this.height - yPos/2) % this.height, dir)
          this.spawnEnemy(xPos, yPos, dir)
          this.spawnEnemy(xPos, (this.height + yPos) % this.height, dir)
          this.spawnEnemy(xPos, (this.height + yPos/2) % this.height, dir)
        } else if (mode == 5) {
          this.spawnEnemy(xPos, (this.height - yPos) % this.height, dir)
          this.spawnEnemy(xPos, yPos, dir)
          this.spawnEnemy(xPos, (this.height + yPos) % this.height, dir)
        } else {
          this.spawnEnemy(xPos, yPos, dir)
        }
        nextEnemy = timestamp + enemyInterval;
        enemyInterval = enemyIntervalMin + (initialInterval * Math.exp(decayRate * intervalTime++))

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
          enemyIntervalMin = 40;
          freqIncrease = Math.PI / 40;
          apertureFactor = 2 + (Math.log(timePlayed))
          return (this.height/2) + (Math.cos(counter) * this.height/2) + (Math.sin(counter) * (this.height/apertureFactor));
        case 2:
          enemyIntervalMin = 10
          freqIncrease = Math.PI / 20;
          apertureFactor = 2 + (Math.log(timePlayed))
          return  (this.height/2) + (Math.sin(counter) * this.height/2) + (Math.sin(counter) * (this.height/apertureFactor));
        case 3: 
          enemyIntervalMin = 20;
          freqIncrease = Math.PI / 500;
          increase = Math.PI / 50;
          apertureFactor = 8 * Math.random();
          return (this.height/2)  + (Math.sin(counter) * this.height/2);
        case 4: 
          enemyIntervalMin = 20;
          freqIncrease = Math.PI / 400;
          increase = Math.PI / 10;
          return (this.height/2)  + (Math.cos(counter) * this.height/2);
        case 5:
          enemyIntervalMin = 10;
          freqIncrease = 1;
          increase = Math.PI / 5;
          return Math.abs((counter % (this.height*2)) - this.height)
        case 6:
          enemyIntervalMin = 5;
          freqIncrease = 3;
          increase = Math.PI/ 10 ;
          return Math.abs((counter % (this.height*2)) - this.height)        
        case 7:
          enemyIntervalMin = 25;
          freqIncrease = 1;
          increase = Math.PI/ 50 ;
          return Math.abs((counter % (this.height*2)) - this.height)

      }


    },

    calculateDir : function () {

      particleCounter += increase;

      switch (mode) {
        case 0:
          return {x: -1, y: 0 }
        case 1: 
          return {x: -1.1, y: 0}
        case 2:
          return {x: -0.4, y: 0.5 - Math.random()}
        case 3:
          return {x: -1.2, y: (Math.cos(particleCounter))}        
        case 4:
          return {x: -2,  y: (Math.sin(particleCounter))}
        case 5:
          return {x: -1.2, y: (Math.sin(particleCounter))}
        case 6:
          return {x: -1.2, y: (Math.cos(particleCounter))}
        default:
          return {x: -1, y: (Math.cos(particleCounter))}

      }

    },


    spawnEnemy : function (xPos, yPos, dir) {

      var enemy = this.game.spawnEntity('enemy');
      enemy.init(xPos, yPos , {
          dir : dir
      })

    }

  }

}