Hero = new Mongo.Collection('hero', {
  transform: function(object) {
      return _.defaults(object, defaults);
  }
});

var defaults = {
  staminaChange: function(sub) {
    this.stamina -= sub;
    if (this.stamina <= 0) this.stamina = 0;
    Hero.update(this._id, { $set: {"stamina": this.stamina}});
    return this.stamina;
  },
  resetStamina: function() {
    this.stamina = this.staminaMax;
    Hero.update(this._id, { $set: {"stamina": this.stamina}});
  },
  resetHealth: function() {
    this.health = this.healthMax;
    Hero.update(this._id, { $set: {"health": this.health}});
  },
  equipItem: function(item) {
    if (item.slot == "head") this.itemHead = item;
    if (item.slot == "chest") this.itemChest = item;
    if (item.slot == "rhand") this.itemRightHand= item;
    if (item.slot == "lhand") this.itemLeftHand = item;
    if (item.slot == "pants") this.itemPants = item;
    Hero.update(this._id, { $set: {
      "itemHead": this.itemHead,
      "itemChest": this.itemChest,
      "itemRightHand": this.itemRightHand,
      "itemLeftHand": this.itemLeftHand,
      "itemPants": this.itemPants
    }});
    this.applyStats();
  },
  unequipItem: function(itemId) {
    var item;
    if (this.itemHead && this.itemHead._id == itemId) {
      item = JSON.parse(JSON.stringify(this.itemHead));
      this.itemHead = "";
    }
    if (this.itemChest && this.itemChest._id == itemId) {
      item = JSON.parse(JSON.stringify(this.itemChest));
      this.itemChest = "";
    }
    if (this.itemRightHand && this.itemRightHand._id == itemId) {
      item = JSON.parse(JSON.stringify(this.itemRightHand));
      this.itemRightHand = "";
    }
    if (this.itemLeftHand && this.itemLeftHand._id == itemId) {
      item = JSON.parse(JSON.stringify(this.itemLeftHand));
      this.itemLeftHand = "";
    }
    if (this.itemPants && this.itemPants._id == itemId) {
      item = JSON.parse(JSON.stringify(this.itemPants));
      this.itemPants = "";
    }
    Hero.update(this._id, { $set: {
      "itemHead": this.itemHead,
      "itemChest": this.itemChest,
      "itemRightHand": this.itemRightHand,
      "itemLeftHand": this.itemLeftHand,
      "itemPants": this.itemPants
    }});
    this.applyStats();
    return item;
  },

  applyStats: function() {
    this.staminaMax = 10;
    this.stamina = 10;
    this.healthMax = 10;
    this.health = 10;
    this.attack = 10;
    this.defense = 10;
    var slots = ["itemHead", "itemChest", "itemRightHand", "itemLeftHand", "itemPants"];
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      if (this[slot] != "undefined" && this[slot] != '') {
        this.staminaMax += this[slot].stamina;
        this.stamina += this[slot].stamina;
        this.healthMax += this[slot].health;
        this.health += this[slot].health;
        this.attack += this[slot].attack;
        this.defense += this[slot].defense;
      }
    };
    Hero.update(this._id, { $set: {
      "staminaMax": this.staminaMax,
      "stamina": this.stamina,
      "healthMax": this.healthMax,
      "health": this.health,
      "attack": this.attack,
      "defense": this.defense
    }});
  },

  fight: function(enemy) {
    var monster = Monster.findOne({"name": enemy});
    if (monster) {
      var maxRounds = ( this.health > monster.health ? monster.health + 0 : this.health + 0);
      console.log("fight started ");
      for (var i = 0; i < maxRounds; i++) {
        console.log("fight round: " + i);
        var heroHit = Math.round(Math.random() * this.attack);
        var monsterDefense = Math.round(Math.random() * monster.attack) * 2;
        var damage = heroHit - monsterDefense;
        if (damage <= 0) damage = 1;
        monster.health -= damage;
        console.log("Hero hit monster for " + damage);
        if (monster.health <= 0) {
          Hero.update(this._id, { $set: {"health": this.health}});
          return true;
        }
        var monsterHit = Math.round(Math.random() * monster.attack);
        var heroDefense = Math.round(Math.random() * this.attack) * 2;
        damage = monsterHit - heroDefense;
        if (damage <= 0) damage = 1;
        this.health -= damage;
        console.log("Monster hit hero for " + damage);
        if (this.health <= 0) {
          return false;
        }
      };
    }
    return false;
  }
}