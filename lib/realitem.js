RealItem = new Mongo.Collection('realitem', {
  transform: function(object) {
      return _.defaults(object, defaults);
  }
});

var defaults = {
}