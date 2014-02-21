entity = require('./entity');
extend = require('../extend');

module.exports = function (game) {


  var base = entity(game);

  var explosion = {

    animation: [
      'explosion_a_01.png',
      'explosion_a_02.png',
      'explosion_a_03.png',
      'explosion_a_04.png',
      'explosion_a_05.png',
      'explosion_a_06.png',
      'explosion_a_07.png'
    ],

    frame: 0,

    init : function(x, y, settings) {

      this.parent(x, y, settings);
      this.id = 'explosion_' + this.guid;
      this.currentSpriteName = this.animation[0];

    },

    update: function(x, y, settings) {

      this.currentSpriteName = this.animation[this.frame++];

      if (this.frame > this.animation.length) {
        this.kill()
      }

    }


  }

  return extend(base, explosion);

}