var Box2D = require('./box2D').Box2D;

// These are global shorthands we declare for Box2D primitives
// we'll be using very frequently.
Vec2 = Box2D.Common.Math.b2Vec2;
BodyDef = Box2D.Dynamics.b2BodyDef;
Body = Box2D.Dynamics.b2Body;
FixtureDef = Box2D.Dynamics.b2FixtureDef;
Fixture = Box2D.Dynamics.b2Fixture;
World = Box2D.Dynamics.b2World;
MassData = Box2D.Collision.Shapes.b2MassData;
PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
CircleShape = Box2D.Collision.Shapes.b2CircleShape;
DebugDraw = Box2D.Dynamics.b2DebugDraw;
RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;


var categories = {
  player: 0x0002,
  enemy : 0x0004,
  bullet : 0x0008,
  wall : 0x0010
};


module.exports = function() {


  return {
    world: null,

    PHYSICS_LOOP_HZ : 1.0/ 60.0,  // update frequency

    PHYSICS_SCALING_FACTOR : 0.1,

    setup: function(canvas) {

      // check defaultos
      var gravity = new Vec2(0, 0)
      

      var sleep = false



      this.world = new World(gravity, sleep)


      // add the walls

      this.addBody({
        entType:'wall',
        x: canvas.width/2,
        y: canvas.height + 10,
        halfHeight: 10,
        halfWidth: canvas.width,
        type: 'static',
        userData : {
          id: 'wall',
          ent: {
            onTouch: function() {
              
            }
          }
        }
      });

      this.addBody({
        entType:'wall',
        x: canvas.width/2,
        y: -1,
        halfHeight: 10,
        halfWidth: canvas.width,
        type: 'static',
        userData : {
          id: 'wall',
          ent: {
            onTouch: function() {

            }
          }
        }
      });


      this.addBody({
        entType:'wall',
        x: -150,
        y: canvas.height/2,
        halfHeight: canvas.height,
        halfWidth: 10,
        type: 'static',
        userData : {
          id: 'wall',
          ent: {
            onTouch: function() {

            }
          }
        }
      });
      
      this.debugDraw = new DebugDraw()
      this.debugDraw.SetSprite(document.getElementsByTagName("canvas")[0].getContext('2d'));
      this.debugDraw.SetDrawScale(1/this.PHYSICS_SCALING_FACTOR);
      this.debugDraw.SetFlags(DebugDraw.e_shapeBit);
      this.debugDraw.SetLineThickness(2.0);
      this.debugDraw.SetFillAlpha(0.6);
      this.world.SetDebugDraw(this.debugDraw);
    },


    update: function() {
      var start = Date.now();

      if (this.world) {
        this.world.Step(
          this.PHYSICS_LOOP_HZ, // update frequency
          10, // velocity passes
          10 // position iteration
        );

        // clear the forces on the world
        // we might want to turn this off sometimes?
        this.world.DrawDebugData();
        this.world.ClearForces();

      }

      return (Date.now() - start);
    },

    registerBody: function(bodyDef) {
      var body = this.world.CreateBody(bodyDef);
      return body;
    },

    addBody: function(entityDef) {
      var bodyDef = new BodyDef();

      var id = entityDef.id;

      if (entityDef.type == 'static') {
        bodyDef.type = Body.b2_staticBody;
      } else {
        bodyDef.type = Body.b2_dynamicBody;
      }

      // set the position
      bodyDef.position.x = entityDef.x * this.PHYSICS_SCALING_FACTOR;
      bodyDef.position.y = entityDef.y * this.PHYSICS_SCALING_FACTOR;

      if (entityDef.hasOwnProperty('userData'))
        bodyDef.userData = entityDef.userData;

      // register the body with the world
      body = this.registerBody(bodyDef);

      // create a fixture def
      var fixtureDef = new FixtureDef();

      

      if (entityDef.hasOwnProperty('vertices')) {
        var polygon = new PolygonShape()
        var vertices = []
        for (var i = 0; i < entityDef.vertices.length; i++) {
          var vtx = entityDef.vertices[i];
          var v = new Vec2()
          v.Set(
            (vtx[0]) * this.PHYSICS_SCALING_FACTOR,
            (vtx[1]) * this.PHYSICS_SCALING_FACTOR
            );
          vertices.push(v)
        }
        polygon.SetAsArray(vertices, vertices.length)
        fixtureDef.shape = polygon;
        fixtureDef.density = 2;



      } else {
        fixtureDef.shape = new PolygonShape()
        fixtureDef.shape.SetAsBox(
          entityDef.halfWidth * this.PHYSICS_SCALING_FACTOR, 
          entityDef.halfHeight * this.PHYSICS_SCALING_FACTOR);
      }


      if (entityDef.hasOwnProperty('density'))
        fixtureDef.density = entityDef.density;
      else
        fixtureDef.density = 0;
        fixtureDef.friction = 0;
        fixtureDef.restitution = 0;

      var categoryBits;
      var maskBits;
      
      categoryBits = categories[entityDef.entType];
      
      if (entityDef.entType === 'player') {
        maskBits = categories.enemy | categories.wall 
      } else if (entityDef.entType === 'bullet') {
        maskBits = categories.enemy
      } else if (entityDef.entType === 'enemy') {
        maskBits = categories.player | categories.bullet
      } else if (entityDef.entType === 'wall') {
        maskBits = categories.player
      }
      
      fixtureDef.filter.categoryBits = categoryBits;
      fixtureDef.filter.maskBits = maskBits;
      

      // give it a fixture
      body.CreateFixture(fixtureDef);

      return body;

    },

    removeBody: function(body) {
      this.world.DestroyBody(body);
    },

    addContactListener: function (callbacks) {
      var listener = new Box2D.Dynamics.b2ContactListener();

      if (callbacks.PostSolve) {

        listener.PostSolve = function(contact, impulse) {
          callbacks.PostSolve(
            contact.GetFixtureA().GetBody(),
            contact.GetFixtureB().GetBody(),
            impulse.normalImpulses[0]
          );

        };
      }

      this.world.SetContactListener(listener);

    },


  }



}