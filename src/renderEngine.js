var spriteSheet = require('./spritesheet');


module.exports = function () {

  var spriteSheets = {}

  return  {

    canvas: null,
    context: null,

    bgCounter : 0,
    bgPattern : null,

    numLoaded : 0,

    spriteSheets: function () {
      return spriteSheets
    },

    setup : function(canvas, assets) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      
      this.assets = assets;

      that = this;

      this.backgroundImage = new Image()
      this.backgroundImage.onload = function () {
        that.bgLoaded = true;
      }

      this.backgroundImage.src = 'images/background.png'

      this.youdiedImage = new Image()
      this.youdiedImage.onload = function () {
        that.youdiedLoaded = true;
      }

      this.youdiedImage.src = 'images/youdied.png'


      this.loadAssets(assets)
    },

    loadAssets : function(assets) {
      for (var i = 0, len = assets.length; i < len; i++) {
        spriteSheets[assets[i]] = spriteSheet().load(assets[i]);
      }
    },

    // tests if all our sprite sheets have loaded
    ready : function() {
      for (var sheetName in spriteSheets) {
        var sheet = spriteSheets[sheetName]
        if (!sheet.loaded()) 
          return false;
        else
          this.numLoaded++
      }

      if (!this.bgLoaded) return false;
      if (!this.youdiedLoaded) return false;

      return true;
    },

    drawBackground : function() {
      

      var startingPoint = --this.bgCounter;
      if (this.backgroundImage) {
        do {
          this.context.drawImage(this.backgroundImage, startingPoint, 0, this.backgroundImage.width, this.backgroundImage.height);
          startingPoint += this.backgroundImage.width;
        } while (startingPoint < this.canvas.width)  
      }

      // if (Math.abs(this.bgCounter) > this.canvas.width ) {
      //   debugger;
      //   this.bgCounter = -(this.backgroundImage.width % this.canvas.width); 
      // }
    },


    drawLoading : function (pct) {

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.context.font = "12px Arial";
      this.context.textAlign = "center";
      this.context.fillStyle = 'yellow';
      this.context.strokeStyle = 'yellow';
      this.context.strokeRect((this.canvas.width/2) - 50, (this.canvas.height/2) - 50, 100, 20);
      this.context.fillRect((this.canvas.width/2) - 50, (this.canvas.height/2) - 50, pct, 20);



      var str = 'Loading ' + Math.ceil(pct) + '%'
      this.context.fillText(str, this.canvas.width /2, this.canvas.height/2)

    },

    drawStart : function () {

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.context.font = "12px Arial";
      this.context.textAlign = "center";
      this.context.fillStyle = 'yellow';
      var str2 = 'WASD or Arrow keys to move, space to fire.';

      var str = 'Press Space to Start';
      this.context.fillText(str2, this.canvas.width /2, (this.canvas.height/2) - 50);
      this.context.fillText(str, this.canvas.width /2, this.canvas.height/2);


    },


    drawDead : function (score) {

      this.context.fillStyle = 'rgba(20, 20, 20, 0.1)'
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.context.drawImage(this.youdiedImage, 
        this.canvas.width/2 - this.youdiedImage.width/2,
        this.canvas.height/2 - this.youdiedImage.height/2
        )

      this.context.font = "32px Arial";
      this.context.textAlign = "center";
      this.context.fillStyle = 'yellow';
      
      this.context.fillText(score, this.canvas.width /2, this.canvas.height/2 + 100);


    },


    drawSprite : function(spriteName, posX, posY) {
      // find the sprite in the sheets
      for (var sheetName in spriteSheets) {

        var sheet = spriteSheets[sheetName];
        var sprite = sheet.getStats(spriteName);

        if (sprite == null) continue;

        this.__drawSprite(sprite, sheet, posX, posY)

        return;
      }

    },

    drawHitbox : function() {

      this.context.strokeStyle = 'white'
      this.context.stroke();
    },

    drawScore : function(score) {

      this.context.font = "30px Arial";
      this.context.textAlign = "end";
      this.context.fillStyle = 'yellow';
      this.context.fillText(score, this.canvas.width - 20, 35)


    },


    drawHealthBar : function (health) {

      this.context.fillStyle = 'red';
      this.context.strokeStyle = 'red';
      this.context.strokeRect(10, 10, 100, 20);
      this.context.fillRect(10, 10, health, 20);

    },


    // drawSprites internal method
    __drawSprite : function (sprite, sheet, posX, posY) {
      if (sprite == null || sheet == null) return;

      this.context.drawImage(
        sheet.img,
        sprite.x,
        sprite.y,
        sprite.w,
        sprite.h,
        posX+sprite.cx,
        posY+sprite.cy,
        sprite.w,
        sprite.h
        );

    }



  }


}