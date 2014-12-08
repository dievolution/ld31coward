Monster = new Mongo.Collection('monster', {
  transform: function(object) {
      return _.defaults(object, defaults);
  }
});

var defaults = {
}