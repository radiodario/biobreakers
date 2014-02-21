
var gameEngine = require('./gameEngine');

var engine;

var canvas = null;
var context = null;
var width = 1024;
var height = 768;
var frame = 0;
var frameRate = 0;




function step (timestamp) {

  engine.run(timestamp)

  requestAnimationFrame(step)


}


var setup = function() {

  var body = document.body;
  canvas = document.createElement('canvas');
  canvas.classList.add('game');
  canvas.width = width;
  canvas.height = height;
  body.appendChild(canvas);

  engine = gameEngine();

  engine.setup(canvas)

  requestAnimationFrame(step)

}



setup();

