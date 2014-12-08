DungeonTemplate = new Mongo.Collection('dungeontemplate', {
  transform: function(object) {
      return _.defaults(object, defaults);
  }
});

var defaults = {
  
}