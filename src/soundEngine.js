
var Sound = function(player) {
  return {
    init: function () {

    },

    play : function(loop, volume) {
      player.playSound(this.path, {looping: loop, volume: volume || 1})
    },

    stop : function() {

    }
  }


}



module.exports = function () {

  var trackID = 0; // music track in the list

  return  {

    clips : {

    },

    enabled: true,

    _context: null,

    _mainNode: null,

    _musicNode : null,

    numLoaded : 0,

    soundReady : false,

    setup: function(sounds) {

      try {
        this._context = new webkitAudioContext();
      }
      catch(e) {
        alert('Web Audio API is not supported in this browser');
      }

      this._mainNode = this._context.createGain(0);
      this._mainNode.connect(this._context.destination);

      var that = this;

      this.loadList(sounds, function() {
        that.soundReady = true;
      })

    },


    ready : function () {
      return this.soundReady;
    },

    loadList: function(list, callback) {

      var that = this;

      function loadedCallback () {
        that.numLoaded++
        if (that.numLoaded === list.length)
          callback()
      }

      for (var i = 0; i < list.length; i++ ) {
        this.loadAsync(list[i], loadedCallback)
      }


    },


    loadAsync: function(path, callbackFcn) {
      if(this.clips[path]){
        callbackFcn(this.clips[path].s);
        return this.clips[path].s;
      }

      var clip = {s: Sound(this),b:null,l:false};
      this.clips[path] = clip;
      clip.s.path = path;

      var request = new XMLHttpRequest();
      request.open('GET', path, true);
      request.responseType = 'arraybuffer';

      var that = this;

      request.onload = function() {
        that._context.decodeAudioData(request.response,
        function(buffer){
                clip.b = buffer;
                clip.l = true;
                callbackFcn(clip.s);
        },
        function(data){

        });
      }
      request.send();


      return clip.s;

    },


    //----------------------------
    isLoaded:function(path) {
      var sd = this.clips[obj.path];
      if(sd == null)
        return false;
      return sd.l;
    },
    //----------------------------
    togglemute: function() {
      if (this._mainNode.gain.value>0)
        this._mainNode.gain.value = 0;
      else
        this._mainNode.gain.value =1;
    },
    // --------------------------
    low: function() {
      this._mainNode.gain.value = 0.2;
    },
    high: function() {
      this._mainNode.gain.value = 1;
    },

    //----------------------------
    stopAll: function() {
      this._mainNode.disconnect();
      this._mainNode = this._context.createGain(0);
      this._mainNode.connect(this._context.destination);
    },

    // rudimentary looping music player
    playMusic: function(tracks) {

      var track = tracks[trackID] // list, [trackName, trackVolume]

      this._musicNode = this._context.createBufferSource();
      this._musicNode.buffer = this.clips[track[0]].b;

      this._musicNode.connect(this._mainNode);
      this._musicNode.loop = false;
      var that = this;
      this._musicNode.onended = function() {
        // set the next track on playlist
        trackID = (trackID + 1) % tracks.length;
        // recursively call playMusic
        that.playMusic(tracks)
      }

      this._musicNode.start();



    },


    //----------------------------
    playSound: function(path, settings) {
      if (!this.enabled )
          return false;

      var looping = false;
      var volume = 0.4;
      if (settings) {
        if(settings.looping)
            looping = settings.looping;
        if(settings.volume)
            volume = settings.volume;
      }

      var sd = this.clips[path];
      if(sd == null)
          return false;
      if(sd.l == false) return false;

      var currentClip = this._context.createBufferSource(); // creates a sound source
      currentClip.buffer = sd.b;          // tell the source which sound to play
      // currentClip.gain.value = volume;
      currentClip.connect(this._mainNode);
      currentClip.loop = looping;
      currentClip.start();              // play the source now
      return true;
    },

    play : function (soundpath, loop, volume) {

      loop = loop || false

      that = this;
      this.loadAsync(soundpath, function(sound) {
        sound.play(loop, volume)
      });
    }

  }


}