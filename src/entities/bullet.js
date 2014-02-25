entity = require('./entity');
extend = require('../extend');

// we pass the game, with access to 
/* .render .input .sound .physics */
module.exports = function(game) {
  
  var base = entity(game);

  var bullet = {

    physBody: null,

    speed: 120,
    lifetime: 20,
    damage: 2,

    size: {
      w : 20,
      h : 20
    },

    animation : [
      'fire_01.png',
      'fire_02.png',
      'fire_03.png',
      'fire_04.png'
    ],

    frame: 0,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.owner = settings.owner
      this.id = 'bullet_' + this.guid
      this.setAnimationFrame()

      this.dir = settings.dir

      
      var entityDef = {
        entType: 'bullet',
        id : this.id,
        x : this.pos.x,
        y : this.pos.y,
        halfWidth: this.size.w * 0.5,
        halfHeight: this.size.h * 0.5,
        damping: 0,
        userData: {
          id: this.id,
          ent: this
        }
      }

      this.physBody = game.physics.addBody(entityDef);

      this.setVelocity();

    },

    setAnimationFrame : function() {
      this.currentSpriteName = this.animation[this.frame]
      this.frame = (this.frame + 1) % this.animation.length
    },

    update : function() {
      this.lifetime -= 0.05;
      if (this.lifetime <= 0) {
        this.kill();
        return;
      }

      this.setAnimationFrame();

      if (this.physBody !== null) {
        // set the velocity again
        this.pos.x = this.physBody.GetPosition().x / game.physics.PHYSICS_SCALING_FACTOR;
        this.pos.y = this.physBody.GetPosition().y / game.physics.PHYSICS_SCALING_FACTOR;
        this.setVelocity(); 
        
      }

      this.parent();
    },

    kill: function() {

      this.parent();

    },


    // what to do when we touch another body
    onTouch: function(otherBody, point, impulse) {

      if (!this.physBody) return false

      if (otherBody === null || !otherBody.GetUserData()) {
        return false;
      }

      // get the entity we've hit
      var hitBody = otherBody.GetUserData();

      if (hitBody.ent === null) return false;
      if (hitBody.ent._killed) return false;
      // no friendly fire
      if (hitBody.id === this.owner) return false

      hitBody.ent.hp -= this.damage;

      this.lifetime = 0;

      return true;

    },
 

    setVelocity : function() {
      var vel = new Vec2(0, 0);
      vel.x = this.dir.x * this.speed;
      vel.y = this.dir.y * this.speed;
      
      this.physBody.SetLinearVelocity(vel);
    }


  }

  return extend(base, bullet);

}