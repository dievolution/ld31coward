// if(Meteor.isServer) {
//     Meteor.publish('default_db_data', function(){
//         return Games.find({});
//     });
// }

Meteor.methods({
  createPlayer: function() {
    var hero = Hero.insert({
      'stamina': 10,
      'staminaMax': 10,
      'health': 10,
      'healthMax': 10,
      'attack': 10,
      'defense': 10,
      'itemHead': '',
      'itemChest': '',
      'itemLeftHand': '',
      'itemRightHand': '',
      'itemPants': ''
    });
    var player = Player.insert({
      'gold': 0,
      'hero': hero,
      'stockpile': [],
      'inventory': [],
      'vendor':[],
      'prestige': 0,
      'prestigeInc': 1,
      'prestigeModifier': 1,
      'dungeonDifficulty': 1
    })
    console.log("player created: " + player);
    return player;
  },

  getPlayer: function(playerId) {
    var returnArray = []
    returnArray["player"] = Player.findOne(playerId);
    returnArray["hero"] = returnArray["player"].getHero();
    console.log(returnArray)
    return returnArray
  }
})