var inputEngine = require('./inputEngine');
var renderEngine = require('./renderEngine');
var physicsEngine = require('./physicsEngine');
var soundEngine = require('./soundEngine');

var bulletHell = require('./bulletHell');

var assets = [
  'robotnik',
  'firing',
  'explosion'
]

var sounds = [

  'sounds/eggman_acid.ogg',
  'sounds/robotnik_laser.ogg',
  'sounds/you_died.ogg',
  'sounds/hitsound.ogg'

]

module.exports = function() {

  return {

    // enginer
    input : inputEngine(),
    render : renderEngine(),
    physics : physicsEngine(),
    sound : soundEngine(),

    bulletHell : bulletHell(),

    loading: true,
    music: true,

    entities: [],
    _deadEntities : [],

    factory : {
      player : require('./entities/player'),
      enemy : require('./entities/enemy'),
      bullet : require('./entities/bullet'),
      explosion : require('./entities/explosion')
    },

    init: function() {

    },

    setup: function(canvas) {
      var that = this;

      document.getElementById('sound').addEventListener('click', function(e) {
        if (that.music) {
          that.music = false
          e.currentTarget.innerHTML = 'Sound OFF'
        } else {
          that.music = true
          e.currentTarget.innerHTML = 'Sound ON'
        }
        that.sound.togglemute();
      })

      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.input.setup(canvas);
      this.physics.setup(canvas);
      this.sound.setup(sounds);
      this.render.setup(canvas, assets);
      this.bulletHell.setup(canvas, this);

      // setup the contact listeners
      this.physics.addContactListener({

        PostSolve: function(bA, bB, impulse) {

          // get the entities contained in user data
          var entA = bA.GetUserData().ent;
          var entB = bB.GetUserData().ent;
          // onTouch takes other entity, instance, impulse
          entA.onTouch(bB, null, impulse);
          entB.onTouch(bA, null, impulse);

        }

      });



    },

    ready : function() {

      return this.sound.ready() && this.render.ready()

    },

    startGame : function() {
      this.start = true;
      this.soundStopped = false;
      // create our player
      this.player = this.spawnEntity('player')

      this.player.init(200, this.canvas.height/2, {});

      if (!this.musicPlaying && this.music) {
        this.sound.play('sounds/eggman_acid.ogg', true, 0.2);
      }
      this.input.bind(32, 'fire'); // rebind to fire

    },

    restart: function() {

      this.start = false;
      this.playerDead = false;


      this.removeAllEntities();


      this.bulletHell = bulletHell()
      this.bulletHell.setup(this.canvas, this)

      this.input.bind(32, 'start'); // rebind to start

    },


    update: function() {

      // update all entities and add the ones that need
      // to die to the deadentities list
      for (var i = 0, len = this.entities.length; i < len; i++) {
        var ent = this.entities[i];
        if (!ent._killed) {
          ent.update();
        } else {
          this._deadEntities.push(ent)
        }
      }

      // remove all of the entities that we oughta kill
      for (var i = 0, len = this._deadEntities.length; i < len; i++) {
        this.removeEntity(this._deadEntities[i]);
      }

      // reset the deadEntities 
      this._deadEntities = [];

      // update the physics
      this.physics.update();


    },


    draw: function (tick) {
      
      this.render.drawBackground();

      // we store the indices of the entities bucketed
      // by z-index
      var entities_by_zIndex = {};
      var zIndex_array = []
      var ent;
      for (var i = 0, len = this.entities.length; i < len; i++) {
        ent = this.entities[i];
        // check that the entity is on-screen
        if (ent.inView(null)) {
          if (zIndex_array.indexOf(ent.zIndex) === -1) {
            zIndex_array.push(ent.zIndex);
            entities_by_zIndex[ent.zIndex] = []
          }
          entities_by_zIndex[ent.zIndex].push(i)
        } 
      }

      // sort the array asc
      zIndex_array.sort(function(a, b) { return a - b });
      // then we iterate over the buckets and draw the entities
      // on that bucket.
      var z, zI, i;
      for (z in zIndex_array) {
        // get the array of entity indexes for this zIndex
        zI = entities_by_zIndex[zIndex_array[z]];
        for (i = 0, len = zI.length; i < len; i++) {
          this.entities[zI[i]].draw(tick);
        }
      }


      this.render.drawHealthBar(this.player.hp);
      this.render.drawScore(this.player.score);

    },


    run: function(timestep) {

      if (!this.ready()) {

        var numAssets = assets.length + sounds.length
        var loaded = this.render.numLoaded + this.sound.numLoaded
        var pct = Math.ceil(loaded/numAssets * 100)

        this.render.drawLoading(pct);

      } else if (!this.start) {
        this.render.drawStart();

        if (this.input.actions['start']) {
          this.startGame()
        }

      } else if (this.playerDead) {
        this.render.drawDead(this.player.score);
        
        if (!this.soundStopped) {
          this.sound.stopAll()
          this.soundStopped = true
          this.sound.play('sounds/you_died.ogg', false, 0.4);
        }
        
        if (this.input.actions['restart']) {          
          this.restart();
        }

      } else {

        this.bulletHell.step(timestep);

        this.update();

        var tick = this.timeSincePhysicsUpdate / this.physics.PHYSICS_LOOP_HZ

        this.draw(tick);
      }



    },


    spawnEntity : function(typename) {

      // the entity needs the engine
      var ent = this.factory[typename](this);

      this.entities.push(ent);

      return ent;

    }, 

    // remove an entity from the entities list
    removeEntity : function (entity) {

      
      try {
        // remove from physics
        if (entity.hasOwnProperty('physBody') || !entity.physBody) {
          this.physics.removeBody(entity.physBody) 
        }
      } catch (e) {
        
      }


      // iterate backwards for speed
      for (var i = this.entities.length; i--; i) {
        if (entity === this.entities[i]) {
          // return early for speed
          return this.entities.splice(i, 1);
        }
      }
    },

    removeAllEntities: function() {

      for (var i = this.entities.length; i--; i) {
        this._deadEntities.push(this.entities[i])
      }

      this.update();




    }


  };



};