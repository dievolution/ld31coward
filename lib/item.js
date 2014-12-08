Item = new Mongo.Collection('item', {
  transform: function(object) {
      return _.defaults(object, defaults);
  }
});

var defaults = {
//   getRandom: function() {
//     var query = { state: 'OK' };
//     var n = Hero.count(query);
//     var r = Math.floor(Math.random() * n);
//     var randomElement = Hero.find(query).limit(1).skip(r);
//     return randomElement;
//   }
}

Item.getRandom = function(ilvl) {
  if (!ilvl) var ilvl = 1;
  var array = Item.find({"ilvl": {$lte: ilvl}}).fetch();
  return _.sample(array);
}