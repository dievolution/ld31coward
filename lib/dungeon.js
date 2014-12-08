Dungeon = new Mongo.Collection('dungeon', {
  transform: function(object) {
      return _.defaults(object, defaults);
  }
});

var defaults = {
  nextRooms: function() {
    var rooms = []
    var startRoom = 0;
    var fullDuration = 0;
    for (var i = 0; i < this.rooms.length; i++) {
      var part = this.rooms[i];
      if (fullDuration + part.duration < this.dungeontime) {
        fullDuration += part.duration;
      } else {
        //count from here
        startRoom = i;
        break
      }
    };
    var counter = 0;
    for (var i = startRoom; i < this.rooms.length; i++) {
      rooms.push(this.rooms[i]);
      counter += 1;
      if (counter >=7) break;
    };
    return rooms;
    // return this.rooms;
  },

  roomsLeft: function() {
    var startRoom = 0;
    var fullDuration = 0;
    for (var i = 0; i < this.rooms.length; i++) {
      var part = this.rooms[i];
      if (fullDuration + part.duration < this.dungeontime) {
        fullDuration += part.duration;
      } else {
        //count from here
        startRoom = i;
        break
      }
    };
    return this.rooms.length - startRoom;
  }
}
/*
  - playerId: player id
  - rooms: list of rooms in the dungeon
  - room: current room
  - dungeontime: time spent in current dungeon
*/

var gameSpeed = 2000; //game speed in milliseconds

Meteor.methods({
  'startDungeon': function(playerId) {
    var player = Player.findOne(playerId)
    Meteor.call('checkPlayerHasDungeon', player);
  },
  'checkPlayerHasDungeon': function(player) {
    if (!player.currentDungeon) {
      player.currentDungeon = createDungeon(player);
    }
    if (!this.isSimulation && player.currentDungeon) {
      intervalArray.push(
        {"id": player._id, "interval":
        Meteor.setInterval(function() {
          player = Player.findOne(player._id)
          tick(player)
        }, gameSpeed)
      })
    }
  },
  'stopDungeon': function(playerId) {
    stopDungeon(playerId);
  }
});

var intervalArray = []

var createDungeon = function(player) {
  var dungeon = {
    "playerId": player._id,
    "rooms": [],
    "room": {"duration": 1, "type": "entrance"},
    "visitedRooms": [{"duration": 1, "type": "entrance"}],
    "dungeontime": 0,
    "difficulty": parseInt(player.dungeonDifficulty)
  };
  var template = DungeonTemplate.findOne({"difficulty": player.dungeonDifficulty});
  //build options
  var options = []
  for (var i = 0; i < template.chests; i++) {options.push("chest");};
  for (var i = 0; i < template.gold; i++) {options.push("gold");};
  for (var i = 0; i < template.monster; i++) {options.push("monster");};
  for (var i = options.length; i < template.rooms; i++) {options.push("nothing");};
  options = _.shuffle(options);
  for (var i = 0; i < options.length; i++) {
    switch (options[i]) {
      case "chest":
        var chestValue = _.sample(template.chestTypes);
        dungeon.rooms.push({"duration": 1, "type": "chest", "value":chestValue});
        break;
      case "gold":
        var goldValue = _.random(template.goldMin, template.goldMax);
        dungeon.rooms.push({"duration": 1, "type": "gold", "value":goldValue});
        break;
      case "monster":
        var monsterValue = _.sample(template.monsterTypes);
        dungeon.rooms.push({"duration": 1, "type": "monster", "value":monsterValue});
        break;
      default:
        dungeon.rooms.push({"duration": 1, "type": "nothing"});
    }
  };

  dungeon.rooms.push({"duration": 1, "type": "boss", "value":template.boss});
  dungeon.rooms.push({"duration": 1, "type": "end"});

  var dungeonId = Dungeon.insert(dungeon);
  Player.update(player._id, { $set: {"currentDungeon": dungeonId}});
  return dungeon;
}

var stopDungeon = function(playerId) {
  var player = Player.findOne(playerId)
  for (var i = 0; i < intervalArray.length; i++) {
    if (intervalArray[i]['id'] == playerId) {
      Meteor.clearInterval(intervalArray[i]['interval']);
      Dungeon.remove(player.currentDungeon);
      player.getHero().resetStamina();
      player.getHero().resetHealth();
      Player.update(playerId, { $unset: {"currentDungeon": ""}});
    }
  };
}

var getCurrentDungeonPart = function(dungeon) {
  var fullDuration = 0;
  for (var i = 0; i < dungeon.rooms.length; i++) {
    var part = dungeon.rooms[i];
    if (fullDuration + part.duration < dungeon.dungeontime) {
      fullDuration += part.duration;
    } else {
      return part
    }
  };
  return dungeon.rooms[dungeon.length-1];
}

var parseCurrentDungeonpart = function(player, part, dungeon) {
  if (part) {
    if (part.type === "gold") {
      Player.update(player._id, { $inc: {'gold': parseInt(part.value)}});
    }
    if (part.type == "end") {
      moveToNextDungeonLevel(player, dungeon);
    }
    if (part.type == "chest") {
      console.log(dungeon.difficulty)
      player.addItemToStockpile(Item.getRandom(dungeon.difficulty));
    }
    if (part.type == "monster" || part.type == "boss") {
      var result = player.getHero().fight(part.value);
      if (result == false) {
        //player lost against monster, one dungeon level back
        if (player.dungeonDifficulty > 1) {
          player.dungeonDifficulty -= 2;
        } 
        moveToNextDungeonLevel(player, dungeon);
      }
    }
  }
  console.log(part)
}

var resetDungeon = function(player, dungeon) {
  player.getHero().resetStamina();
  player.getHero().resetHealth();
  dungeon.dungeontime = 0;
  dungeon.visitedRooms = [];
  Dungeon.update(dungeon._id, {$set: {
    'dungeontime': dungeon.dungeontime,
    'visitedRooms': []
  }})
}

var moveToNextDungeonLevel = function(player, dungeon) {
  stopDungeon(player._id);
  Dungeon.remove(dungeon._id);
  if (player.dungeonDifficulty < DungeonTemplate.find({}).count()) {
    player.dungeonDifficulty += 1;
    Player.update(player._id, { $set: {"dungeonDifficulty": player.dungeonDifficulty}});
  }
  player = Player.findOne(player._id);
  Meteor.call("checkPlayerHasDungeon", player);
}

var tick = function(player) {
  var updateArray = {};
  if (!player.currentDungeon) return;
  //load dungeon from collection
  var dungeon = Dungeon.findOne({"playerId": player._id})
  if (!dungeon) return;
  //increase time spent in dungeon
  dungeon.dungeontime += 1;
  //hero stamina test
  player.getHero().staminaChange(1);
  //get current dungeonpart relative to time spent in dungeon
  var part = getCurrentDungeonPart(dungeon);
  parseCurrentDungeonpart(player, part, dungeon);
  //what happens when hero is out of stamina
  if (player.getHero().stamina <= 0) {
    //hero is out of stamina, return to entrance and reset stamina
    resetDungeon(player, dungeon);
  } else {
    //update dungeon
    dungeon.visitedRooms.push(part);
    Dungeon.update(dungeon._id, {$set: {
      'dungeontime': dungeon.dungeontime,
      'room': part,
      'visitedRooms': dungeon.visitedRooms
    }})
  }
} 