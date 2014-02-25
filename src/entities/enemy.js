entity = require('./entity');
extend = require('../extend');

module.exports = function(game) {

  var base = entity(game);

  var enemy = {

    physBody: null,
    hp: 2,
    speed: 50,
    size : {
      w: 26,
      h: 26,
    },

    damage: 2,

    currentSpriteName: 'enemy_01.png',
    frame: 0,

    animation : [
      'enemy_01.png',
      'enemy_02.png',
      'enemy_03.png',
      'enemy_04.png'
    ],

    init: function (x, y, settings) {

      this.parent(x, y, settings);
      var startPos = this.pos;

      this.dir = settings.dir || new Vec2(-1, 0); // by default make it go against us

      this.id = 'enemy_' + this.guid;

      var entityDef = {
        entType: 'enemy',
        id: this.id,
        x: this.pos.x,
        y: this.pos.y,
        halfWidth: this.size.w * 0.5,
        halfHeight: this.size.h * 0.5,
        damping: 0,
        userData : {
          id: this.id,
          ent: this
        }
      }

      this.physBody = game.physics.addBody(entityDef);

     

    },


    update: function() {

      if (this.hp <= 0) {
        this.kill();
        return;
      }

      this.setAnimationFrame();

       // update the physics body
      if (this.physBody !== null) {
        this.pos.x = this.physBody.GetPosition().x / game.physics.PHYSICS_SCALING_FACTOR;
        this.pos.y = this.physBody.GetPosition().y / game.physics.PHYSICS_SCALING_FACTOR;
        this.setVelocity();
      }

      this.parent();

      if (this.pos.x < -20) {
        this.kill(true)
      }

      if (this.pos.y < -20) {
        this.kill(true)
      }

      if (this.pos.y > game.canvas.height + 20) {
        this.kill(true)
      }

    },

    kill : function(noscore) {

      var exp = game.spawnEntity('explosion');
      exp.init(this.pos.x, this.pos.y, {});

      // only give points when the player has killed it
      if (!noscore) {
        game.player.score++
      }


      this.parent();
    },


    setAnimationFrame : function() {
      this.currentSpriteName = this.animation[this.frame]
      this.frame = (this.frame + 1) % this.animation.length
    },

    setVelocity : function() {
      vel = new Vec2(0, 0)
      vel.x = (this.dir.x * this.speed);
      vel.y = (this.dir.y * this.speed);
      this.physBody.SetLinearVelocity(vel);
      // this.physBody.ApplyImpulse(vel, this.physBody.GetWorldCenter());
    },

     // what to do when we touch another body
    onTouch: function(otherBody, point, impulse) {

      if (!this.physBody) return false

      if (otherBody === null || !otherBody.GetUserData()) {
        return false;
      }

      // get the entity we've hit
      var hitEntity = otherBody.GetUserData();

      if (hitEntity.ent === null) return false;
      if (hitEntity.ent._killed) return false;
      if (hitEntity.id.indexOf('player') !== 0) return false
      
      hitEntity.ent.hp -= this.damage;

      this.hp = 0;

    }



  }

  return extend(base, enemy);

}