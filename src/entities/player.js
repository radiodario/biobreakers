entity = require('./entity');
extend = require('../extend');


module.exports = function(game) {

  var base = entity(game);

  var player = {

    physBody : null,
    hp: 100,
    speed: 100,

    size: {
      w: 200,
      h: 155
    },

    score: 0,

    nextFireTime : 0,
    fireDelay : 150,

    currentSpriteName: 'robotnik_stand_right.png',

    init : function(x, y, settings) {

      this.parent(x, y, settings);
      this.id = 'player_' + this.guid;
      console.log(this.pos)

      this.dir = settings.dir || new Vec2(0,0)

      var entityDef =  {
        entType: 'player',
        id : this.id,
        x : this.pos.x,
        y : this.pos.y,
        halfWidth: this.size.w * 0.5,
        halfHeight: this.size.h * 0.5,
        damping: 0,
        userData: {
          id: this.id,
          ent: this
        },
        vertices: [
          [101.000,7.000],
          [53.000,62.000 ],
          [-84.000,62.000 ],
          [-84.000,-63.000],
          [-50.000,-62.000],
          [24.000,-47.000 ]
        ]
      }

      this.physBody = game.physics.addBody(entityDef);

    },

    update: function() {

      if (this.hp <= 0) {
        this.kill();
        return;
        // probably have to do a gameover thing
      }

      this.currentSpriteName = 'robotnik_stand_right.png'

      // fire if we're firing
      if (game.input.actions['fire'])
        this.fire();


      // update the physics body
      if (this.physBody !== null) {
        this.pos.x = this.physBody.GetPosition().x / game.physics.PHYSICS_SCALING_FACTOR;
        this.pos.y = this.physBody.GetPosition().y / game.physics.PHYSICS_SCALING_FACTOR;
        this.updateDirection();
      }

      this.parent();

    },


    kill : function () {
      game.playerDead = true;
      // what an exotic place to put a binding my friend
      game.input.bind(32, 'restart');
      this.parent();

    },


    setVelocity : function() {
      vel = new Vec2(0, 0)
      vel.x = (this.dir.x * this.speed);
      vel.y = (this.dir.y * this.speed);
      this.physBody.SetLinearVelocity(vel);
      // this.physBody.ApplyLinearImpulse(vel, this.physBody.GetWorldCenter());
    },


    updateDirection : function() {
      this.dir = new Vec2(0, 0);
      if (game.input.actions['move-up'])
        this.dir.y--;
      if (game.input.actions['move-down'])
        this.dir.y++;
      if (game.input.actions['move-left'])
        this.dir.x--;
      if (game.input.actions['move-right'])
        this.dir.x++;

      this.dir.Normalize();

      this.setVelocity();

    },

    fire: function() {
      if (this.nextFireTime > new Date().getTime()) {
        return
      }
      else {
        game.sound.play('sounds/robotnik_laser.mp3', false, 0.2);


        var mode = game.bulletHell.mode()

        if (mode > 0) {
          this.fireDelay = 500/mode;
        }
        
        // shoot the first bullet
        if (mode == 0 || mode > 2) {
          var bullet = game.spawnEntity('bullet')
          bullet.init(
            this.pos.x + ( this.size.w * 0.5 ) + 20, 
            this.pos.y, 
            {
            owner : "player_" + this.guid,
            dir : {
              x: 1,
              y: 0
            }
          });
        }


        // shoot two bullets
        if (mode == 1 || mode == 2) {
          var bullet = game.spawnEntity('bullet')
          bullet.init(
              this.pos.x + ( this.size.w * 0.5 ) + 20, 
              this.pos.y, 
            {
            owner : "player_" + this.guid,
            dir : {
              x: 1,
              y: -0.15
            }
          });

          bullet = game.spawnEntity('bullet')
          bullet.init(
              this.pos.x + ( this.size.w * 0.5 ) + 20, 
              this.pos.y, 
            {
            owner : "player_" + this.guid,
            dir : {
              x: 1,
              y: 0.15
            }
          });
        }

        
        if (mode > 2 && mode < 6) {
          var bullet = game.spawnEntity('bullet')
          bullet.init(
              this.pos.x + ( this.size.w * 0.5 ) + 20, 
              this.pos.y, 
            {
            owner : "player_" + this.guid,
            dir : {
              x: 1,
              y: -0.25
            }
          });

          bullet = game.spawnEntity('bullet')
          bullet.init(
              this.pos.x + ( this.size.w * 0.5 ) + 20, 
              this.pos.y, 
            {
            owner : "player_" + this.guid,
            dir : {
              x: 1,
              y: 0.25
            }
          });
        }

        if  (mode >= 6) {
          var bullet = game.spawnEntity('bullet')
          bullet.init(
              this.pos.x + ( this.size.w * 0.5 ) + 20, 
              this.pos.y, 
            {
            owner : "player_" + this.guid,
            dir : {
              x: 2,
              y: -0.45
            }
          });          

          var bullet = game.spawnEntity('bullet')
          bullet.init(
              this.pos.x + ( this.size.w * 0.5 ) + 20, 
              this.pos.y, 
            {
            owner : "player_" + this.guid,
            dir : {
              x: 2,
              y: -0.25
            }
          });

          bullet = game.spawnEntity('bullet')
          bullet.init(
              this.pos.x + ( this.size.w * 0.5 ) + 20, 
              this.pos.y, 
            {
            owner : "player_" + this.guid,
            dir : {
              x: 2,
              y: 0.25
            }
          });

          bullet = game.spawnEntity('bullet')
          bullet.init(
              this.pos.x + ( this.size.w * 0.5 ) + 20, 
              this.pos.y, 
            {
            owner : "player_" + this.guid,
            dir : {
              x: 2,
              y: 0.45
            }
          });



        }

        this.nextFireTime = new Date().getTime() + this.fireDelay
      }
     
      
      

    },

    // what to do when we touch another body
    onTouch: function(otherBody, point, impulse) {

      if (otherBody === null || !otherBody.GetUserData()) {
        return false;
      }

      var hitBody = otherBody.GetUserData();
      if (hitBody.ent.owner === this.id) return false

      if (hitBody.id == 'wall') return false

      this.currentSpriteName = 'robotnik_stand_right_hurt.png';
      game.sound.play('sounds/hitsound.mp3', false, 0.05);

    }



  }

  

  return extend(base, player);

}