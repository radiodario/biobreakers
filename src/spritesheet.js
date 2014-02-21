// A rough sprite sheet!

module.exports = function(assetManager) {

  return {

    img: null,

    imageUrl: "",

    sprites: [],

    loaded: function() {
      return this.imageLoaded && this.spritesLoaded
    },

    init : function() {

    },

    load : function(name) {
      this.loadImage(name);
      this.loadSpriteDefinition(name);
      // return the spritesheet
      return this;
    },

    loadImage : function(name) {
      this.imageUrl = 'images/' + name + '.png';
      this.img = new Image();

      var that = this;

      this.img.onload = function() {
        that.imageLoaded = true;
      }
      this.img.src = this.imageUrl;
    },

    loadSpriteDefinition : function(name) {

      var req = new XMLHttpRequest();

      var that = this;

      req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
          that.parseAtlasDefinition(req.responseText);
        }
      };

      req.open('GET', 'images/' + name + '.json');
      req.send();

    },


    defSprite : function(name, x, y, w, h, cx, cy) {

      var sprite = {
        id : name,
        x : x,
        y : y,
        w : w,
        h : h,
        cx : cx === null ? 0 : cx,
        cy : cy === null ? 0 : cy
      };

      this.sprites.push(sprite);

    },



    parseAtlasDefinition : function (atlasJSON) {
      var parts = JSON.parse(atlasJSON),
          part = {},
          cx, cy

      for (var i = 0, len = parts.frames.length; i < len; i++) {
        part = parts.frames[i];

        cx = -part.frame.w * 0.5;
        cy = -part.frame.h * 0.5;

        if (part.trimmed) {
          cx = part.spriteSourceSize.x - (part.sourceSize.w * 0.5);
          cy = part.spriteSourceSize.y - (part.sourceSize.h * 0.5);
        }

        this.defSprite(
          part.filename,
          part.frame.x,
          part.frame.y,
          part.frame.w,
          part.frame.h,
          cx,
          cy
        )

      }

      this.spritesLoaded = true;

    },

    // get the sprite we want
    getStats: function(name) {
      for (var i = 0, len = this.sprites.length; i < len; i++) {
        if (this.sprites[i].id === name)
          return this.sprites[i] 
      }

      return null;

    }

  }

}