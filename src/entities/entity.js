guid = require('../guid');

module.exports = function(game) {

  return {

    pos : {
      x : 0,
      y : 0
    },

    size : {
      w : 0,
      h : 0
    },

    zIndex: 0,

    _killed: false,

    guid : guid(),

    currentSpriteName: '',

    init: function(x, y, settings) {
      this.pos.x = x;
      this.pos.y = y;
    },

    update:  function() {
      
    },

    draw: function() {

      game.render.drawSprite(this.currentSpriteName,
        Math.ceil(this.pos.x),
        Math.ceil(this.pos.y)
        );

      game.render.drawHitbox();

    },

    kill : function() {
      this._killed = true;
    },

    // check that the entity is in the map
    inView : function(map) {

      var map = map || {
        viewRect : {
          x : 0,
          y : 0,
          w : game.canvas.width,
          h : game.canvas.height
        }
      };

      var fudgeVariance = 128

      // check that the entity is in bounds. This could be done in the map as well
      // which would kinda make more sense but to be honest it doesn't matter that
      // much hey hey hey
      return (this.pos.x >= map.viewRect.x - fudgeVariance &&
              this.pos.x <  map.viewRect.x + map.viewRect.w + fudgeVariance &&
              this.pos.y >= map.viewRect.y - fudgeVariance &&
              this.pos.y <  map.viewRect.y + map.viewRect.h + fudgeVariance);

    }


  }

}

