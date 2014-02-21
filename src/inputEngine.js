module.exports = function() {




  return  {

    bindings: {},
    actions : {},

    mouse: {
      x : 0,
      y : 0
    },

    setup: function (canvas) {

      this.bind(87, 'move-up');    // W
      this.bind(65, 'move-left');  // A
      this.bind(83, 'move-down');  // S
      this.bind(68, 'move-right'); // D
      
      this.bind(32, 'start');       // SPACE

      

      canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
      window.addEventListener('keydown', this.onKeyDown.bind(this));
      window.addEventListener('keyup', this.onKeyUp.bind(this));
    },

    bind: function(key, action) {
      this.bindings[key] = action;
      this.actions[action] = false;
    },


    onMouseMove: function(event) {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
    },

    onKeyDown: function(event) {
      var action = this.bindings[event.keyCode];

      if (action) {
        this.actions[action] = true
      }


    },

    onKeyUp: function(event) {
      var action = this.bindings[event.keyCode];

      if (action)
        this.actions[action] = false
    }


  }



}