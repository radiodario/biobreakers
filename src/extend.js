

module.exports = function(parentClass, newClass) {
  

  var result = {};
  
  // add the properties in parentClass
  for (var property in parentClass) {
    result[property] = parentClass[property]
  }


  for (var property in newClass) {
    // careful with this, we're assuming we're only extending our own things
    // man i should just use prototypal.
    if (result.hasOwnProperty(property) && typeof (result[property]) == 'function') {


      // update with the new thing
      result[property] = (function(name, fn){
        // save a copy
        var copy = parentClass[property];
      
        return function () {
          this.parent = copy;
          var ret = fn.apply(this, arguments)
          return ret;
        }

      })(property, newClass[property])


    } else {
      result[property] = newClass[property]
    }


  }



  return result;

}