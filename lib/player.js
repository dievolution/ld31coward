Player = new Mongo.Collection('player', {
  transform: function(object) {
      return _.defaults(object, defaults);
  }
});

var defaults = {
  getHero: function() {
    return Hero.findOne(this.hero);
  },

  addItemToStockpile: function(item) {
    //max stockpile size == 10
    if (this.stockpile.length < 10) {
      var realitem = this.createRealItem(item);
      this.stockpile.push(realitem);
      Player.update(this._id, { $set: {"stockpile": this.stockpile}});
    } else {
      //autosell for 5% of item value
      Player.update(this._id, { $inc: {'gold': parseInt(item.value * 0.05)}});
    }
  },
  createRealItem: function(blueprint, inChest) {
    var rarity = ""
    var rarityMod = 1;
    var rarityNum = _.random(1,1000);
    if (rarityNum < 800) {
      rarity = "common";
      rarityMod = 1;
    }
    else if (rarityNum < 920) {
      rarity = "uncommon";
      rarityMod = 2;
    }
    else if (rarityNum < 970) {
      rarity = "rare";
      rarityMod = 5;
    } else if (rarityNum < 995) {
      rarity = "epic";
      rarityMod = 10;
    }
    else if (rarityNum < 999) {
      rarity = "legendary";
      rarityMod = 25;
    }

    if (typeof inChest == "undefined") inChest = true;

    var id = RealItem.insert({
      'playerId': this._id,
      'name': blueprint.name,
      'type': blueprint.type,
      'slot': blueprint.slot,
      'stamina': _.random(blueprint.staminaMin, blueprint.staminaMax) * rarityMod,
      'health': _.random(blueprint.healthMin, blueprint.healthMax) * rarityMod,
      'attack': _.random(blueprint.attackMin, blueprint.attackMax) * rarityMod,
      'defense': _.random(blueprint.defenseMin, blueprint.defenseMax) * rarityMod,
      'value': blueprint.value * rarityMod,
      'price': parseInt(blueprint.value * rarityMod * (_.random(5,40) / 10)),
      'inChest': inChest,
      'rarity' : rarity,
      'image': blueprint.image,
      'prestigeModifier': blueprint.prestigeModifier * rarityMod,
      'ilvl': blueprint.ilvl
    });
    return RealItem.findOne(id);
  },
  removeChest: function(itemId) {
    for (var i = 0; i < this['stockpile'].length; i++) {
      item = this['stockpile'][i];
      if (item._id == itemId) {
        this['stockpile'][i].inChest = false;
        break;
      }
    };
    Player.update(this._id, { $set: {"stockpile": this.stockpile}});
  },
  calculatePrestigeModifier: function() {
    var prestigeModifier = 1;
    for (var i = 0; i < this['inventory'].length; i++) {
      item = this['inventory'][i];
      prestigeModifier += item.prestigeModifier;
    }
    this.prestigeModifier = prestigeModifier;
    Player.update(this._id, { $set: {"prestigeModifier": prestigeModifier}});
    Meteor.call("startPrestigeCount", this._id);
  },
  updateShopItems: function() {
    //clear old vendor items
    for (var i = 0; i < 3; i++) {
      if (this.vendor[i]) RealItem.remove(this.vendor[i]._id);
    }
    this.vendor = [];
    //get current item levels on hero
    var slots = ["itemHead", "itemRightHand", "itemLeftHand", "itemChest", "itemPants"];
    for (var i = 0; i < 3; i++) {
      var slot = _.sample(slots);
      var slotitem = this.getHero()[slot];
      if (slotitem) {
        var blueprint = Item.getRandom(slotitem.ilvl + 1);
        this.vendor.push(this.createRealItem(blueprint, false));
      } else {
        var blueprint = Item.getRandom(1);
        this.vendor.push(this.createRealItem(blueprint, false));
      }
    };
    Player.update(this._id, { $set: {"vendor": this.vendor}});
  }
}

Meteor.methods({
  'moveToInventory': function(itemId, from, uuid) {
    //get item from old stack
    var item;
    player = Player.findOne(uuid);
    for (var i = 0; i < player[from].length; i++) {
      item = player[from][i];
      if (item._id == itemId) {
        player[from].splice(i, 1);
        break;
      }
    };
    //substract gold if taken from shop
    if (from == "vendor") {
      Player.update(player._id, { $set: {'gold': player.gold - item.price}});
    }
    player['inventory'].push(item);
    Player.update(player._id, { $set: {"stockpile": player.stockpile}});
    Player.update(player._id, { $set: {"inventory": player.inventory}});
    Player.update(player._id, { $set: {"vendor": player.vendor}});
    player.calculatePrestigeModifier();
  },
  'sellItem': function(itemId, from, uuid) {
    var item;
    player = Player.findOne(uuid);
    for (var i = 0; i < player[from].length; i++) {
      item = player[from][i];
      if (item._id == itemId) {
        player[from].splice(i, 1);
        break;
      }
    };
    player.gold += parseInt(item.value);
    Player.update(player._id, { $set: {"gold": player.gold}});
    var updateArray = {};
    updateArray[from] = player[from];
    Player.update(player._id, { $set: updateArray});
  },
  'equip': function(itemId, from, uuid) {
    var item;
    player = Player.findOne(uuid);
    for (var i = 0; i < player[from].length; i++) {
      item = player[from][i];
      if (item._id == itemId) {
        player[from].splice(i, 1);
        break;
      }
    };
    player.getHero().equipItem(item);
    var updateArray = {};
    updateArray[from] = player[from];
    Player.update(player._id, { $set: updateArray});
  },
  'unequip': function(itemId, from, uuid) {
    player = Player.findOne(uuid);
    var item = player.getHero().unequipItem(itemId);
    player['inventory'].push(item);
    Player.update(player._id, { $set: {"inventory": player.inventory}});
  },
  'startPrestigeCount': function(uuid) {
    var player = Player.findOne(uuid);
    if (!this.isSimulation) {
      //clear old interval
      for (var i = 0; i < prestigeIntervalArray.length; i++) {
        if (prestigeIntervalArray[i]['id'] == player._id) {
          Meteor.clearInterval(prestigeIntervalArray[i]['interval']);
        };
      }
      //start neww count
      prestigeIntervalArray.push(
        {"id": player._id, "interval":
        Meteor.setInterval(function() {
          player = Player.findOne(uuid);
          var increase = parseInt(player.prestigeModifier * player.prestigeInc * Math.ceil(player.dungeonDifficulty/10));
          Player.update(player._id, { $inc: {"prestige": increase}});
        }, 5000)
      })
    }
  }
});

var prestigeIntervalArray = []