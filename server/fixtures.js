Meteor.startup(function () {
  // Force new Players each time
  // TODO: Change before publishing
  if (Meteor.isServer) {
     // Player.remove({});
     // Hero.remove({});
     Item.remove({});
     // RealItem.remove({});
     Monster.remove({});
     // Dungeon.remove({});
     DungeonTemplate.remove({});
  }

  if (Hero.find().count() == 0) {
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
  }
  if (Player.find().count() == 0) {
    Player.insert({
      'name': "Testuser",
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
  }

  if (Monster.find().count() == 0) {
    Monster.insert({
      'name': 'goblin',
      'health': 5,
      'healthMax': 5,
      'attack': 8,
      'defense': 8
    });
    Monster.insert({
      'name': 'snowman',
      'health': 15,
      'healthMax': 15,
      'attack': 5,
      'defense': 9
    });
    Monster.insert({
      'name': 'spider',
      'health': 35,
      'healthMax': 35,
      'attack': 15,
      'defense': 50
    });
    Monster.insert({
      'name': 'endboss',
      'health': 150,
      'healthMax': 150,
      'attack': 35,
      'defense': 80
    });
  }

  if (DungeonTemplate.find().count() == 0) {
    DungeonTemplate.insert({
      'difficulty': 1,
      'rooms': 10,
      'chests': 2,
      'chestTypes': ['small'],
      'gold': 2,
      'goldMin': 1,
      'goldMax': 5,
      'monster': 1,
      'monsterTypes': ['goblin'],
      'boss': 'snowman'
    });
    DungeonTemplate.insert({
      'difficulty': 2,
      'rooms': 20,
      'chests': 4,
      'chestTypes': ['small'],
      'gold': 5,
      'goldMin': 2,
      'goldMax': 8,
      'monster': 3,
      'monsterTypes': ['goblin'],
      'boss': 'snowman'
    });
    DungeonTemplate.insert({
      'difficulty': 3,
      'rooms': 25,
      'chests': 3,
      'chestTypes': ['small'],
      'gold': 6,
      'goldMin': 4,
      'goldMax': 15,
      'monster': 5,
      'monsterTypes': ['goblin'],
      'boss': 'snowman'
    });
    DungeonTemplate.insert({
      'difficulty': 4,
      'rooms': 35,
      'chests': 5,
      'chestTypes': ['small'],
      'gold': 8,
      'goldMin': 20,
      'goldMax': 100,
      'monster': 10,
      'monsterTypes': ['goblin', 'spider'],
      'boss': 'snowman'
    });
    DungeonTemplate.insert({
      'difficulty': 5,
      'rooms': 100,
      'chests': 20,
      'chestTypes': ['small'],
      'gold': 20,
      'goldMin': 100,
      'goldMax': 500,
      'monster': 20,
      'monsterTypes': ['goblin', 'spider'],
      'boss': 'endboss'
    });
  }

  if (Item.find().count() == 0) {
    Item.insert({
      'name': 'The Sword of Coolness',
      'ilvl': 1,
      'type': 'equipment',
      'slot': 'rhand',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 0,
      'healthMax': 0,
      'attackMin': 1,
      'attackMax': 3,
      'defenseMin': 0,
      'defenseMax': 0,
      'value': 10,
      'image': 'sword1',
      'prestigeModifier': 0.1
    });
    Item.insert({
      'name': 'Iron Plate Chestplate',
      'ilvl': 1,
      'type': 'equipment',
      'slot': 'chest',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 1,
      'healthMax': 1,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 1,
      'defenseMax': 1,
      'value': 10,
      'image': 'chest1',
      'prestigeModifier': 0.1
    });
    Item.insert({
      'name': 'Stunning Helmet',
      'ilvl': 1,
      'type': 'equipment',
      'slot': 'head',
      'staminaMin': 1,
      'staminaMax': 3,
      'healthMin': 0,
      'healthMax': 0,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 0,
      'defenseMax': 0,
      'value': 10,
      'image': 'helm1',
      'prestigeModifier': 0.1
    });
    Item.insert({
      'name': 'Shiny Legplates',
      'ilvl': 1,
      'type': 'equipment',
      'slot': 'pants',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 1,
      'healthMax': 1,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 1,
      'defenseMax': 2,
      'value': 10,
      'image': 'pants1',
      'prestigeModifier': 0.1
    });
    Item.insert({
      'name': 'The Triangle Shield',
      'ilvl': 1,
      'type': 'equipment',
      'slot': 'lhand',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 0,
      'healthMax': 0,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 3,
      'defenseMax': 4,
      'value': 20,
      'image': 'shield1',
      'prestigeModifier': 0.2
    });
    Item.insert({
      'name': 'The Sword of Hotness',
      'ilvl': 2,
      'type': 'equipment',
      'slot': 'rhand',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 0,
      'healthMax': 0,
      'attackMin': 2,
      'attackMax': 5,
      'defenseMin': 0,
      'defenseMax': 0,
      'value': 20,
      'image': 'sword1',
      'prestigeModifier': 0.2
    });
    Item.insert({
      'name': 'The Best Sword',
      'ilvl': 3,
      'type': 'equipment',
      'slot': 'rhand',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 0,
      'healthMax': 0,
      'attackMin': 5,
      'attackMax': 12,
      'defenseMin': 0,
      'defenseMax': 0,
      'value': 30,
      'image': 'sword1',
      'prestigeModifier': 0.3
    });
    Item.insert({
      'name': 'Super Sword',
      'ilvl': 3,
      'type': 'equipment',
      'slot': 'rhand',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 0,
      'healthMax': 0,
      'attackMin': 10,
      'attackMax': 12,
      'defenseMin': 0,
      'defenseMax': 0,
      'value': 40,
      'image': 'sword1',
      'prestigeModifier': 0.3
    });
    Item.insert({
      'name': 'Master Sword',
      'ilvl': 4,
      'type': 'equipment',
      'slot': 'rhand',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 0,
      'healthMax': 0,
      'attackMin': 12,
      'attackMax': 20,
      'defenseMin': 0,
      'defenseMax': 0,
      'value': 50,
      'image': 'sword1',
      'prestigeModifier': 0.4
    });
    Item.insert({
      'name': 'Sword of Eden',
      'ilvl': 2,
      'type': 'equipment',
      'slot': 'rhand',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 2,
      'healthMax': 4,
      'attackMin': 6,
      'attackMax': 10,
      'defenseMin': 0,
      'defenseMax': 0,
      'value': 60,
      'image': 'sword1',
      'prestigeModifier': 0.2
    });
    Item.insert({
      'name': 'The Sword of Colossus',
      'ilvl': 5,
      'type': 'equipment',
      'slot': 'rhand',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 10,
      'healthMax': 10,
      'attackMin': 12,
      'attackMax': 25,
      'defenseMin': 0,
      'defenseMax': 0,
      'value': 100,
      'image': 'sword1',
      'prestigeModifier': 0.6
    });
    Item.insert({
      'name': 'The Square Shield',
      'ilvl': 2,
      'type': 'equipment',
      'slot': 'lhand',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 5,
      'healthMax': 10,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 6,
      'defenseMax': 9,
      'value': 30,
      'image': 'shield1',
      'prestigeModifier': 0.3
    });
    Item.insert({
      'name': 'The Round Shield',
      'ilvl': 3,
      'type': 'equipment',
      'slot': 'lhand',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 20,
      'healthMax': 30,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 10,
      'defenseMax': 15,
      'value': 30,
      'image': 'shield1',
      'prestigeModifier': 0.3
    });
    Item.insert({
      'name': 'The Rectangle Shield',
      'ilvl': 4,
      'type': 'equipment',
      'slot': 'lhand',
      'staminaMin': 3,
      'staminaMax': 8,
      'healthMin': 40,
      'healthMax': 50,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 16,
      'defenseMax': 25,
      'value': 40,
      'image': 'shield1',
      'prestigeModifier': 0.4
    });
    Item.insert({
      'name': 'The Shield (not WWE)',
      'ilvl': 5,
      'type': 'equipment',
      'slot': 'lhand',
      'staminaMin': 10,
      'staminaMax': 15,
      'healthMin': 60,
      'healthMax': 80,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 35,
      'defenseMax': 60,
      'value': 100,
      'image': 'shield1',
      'prestigeModifier': 0.5
    });
    Item.insert({
      'name': 'Shiny Helmet',
      'ilvl': 2,
      'type': 'equipment',
      'slot': 'head',
      'staminaMin': 5,
      'staminaMax': 10,
      'healthMin': 0,
      'healthMax': 0,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 2,
      'defenseMax': 5,
      'value': 20,
      'image': 'helm1',
      'prestigeModifier': 0.2
    });
    Item.insert({
      'name': 'Very Shiny Helmet',
      'ilvl': 3,
      'type': 'equipment',
      'slot': 'head',
      'staminaMin': 10,
      'staminaMax': 20,
      'healthMin': 0,
      'healthMax': 0,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 3,
      'defenseMax': 8,
      'value': 30,
      'image': 'helm1',
      'prestigeModifier': 0.3
    });
    Item.insert({
      'name': 'Bright Helmet',
      'ilvl': 4,
      'type': 'equipment',
      'slot': 'head',
      'staminaMin': 15,
      'staminaMax': 25,
      'healthMin': 0,
      'healthMax': 0,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 0,
      'defenseMax': 0,
      'value': 50,
      'image': 'helm1',
      'prestigeModifier': 0.5
    });
    Item.insert({
      'name': 'Lord Helmet',
      'ilvl': 5,
      'type': 'equipment',
      'slot': 'head',
      'staminaMin': 25,
      'staminaMax': 35,
      'healthMin': 5,
      'healthMax': 10,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 10,
      'defenseMax': 10,
      'value': 100,
      'image': 'helm1',
      'prestigeModifier': 0.8
    });
    Item.insert({
      'name': 'Silver Plate Chestplate',
      'ilvl': 2,
      'type': 'equipment',
      'slot': 'chest',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 3,
      'healthMax': 8,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 2,
      'defenseMax': 5,
      'value': 20,
      'image': 'chest1',
      'prestigeModifier': 0.2
    });
    Item.insert({
      'name': 'Golden Plate Chestplate',
      'ilvl': 3,
      'type': 'equipment',
      'slot': 'chest',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 10,
      'healthMax': 20,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 5,
      'defenseMax': 10,
      'value': 30,
      'image': 'chest1',
      'prestigeModifier': 0.3
    });
    Item.insert({
      'name': 'Diamond Plate Chestplate',
      'ilvl': 4,
      'type': 'equipment',
      'slot': 'chest',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 20,
      'healthMax': 30,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 10,
      'defenseMax': 20,
      'value': 40,
      'image': 'chest1',
      'prestigeModifier': 0.5
    });
    Item.insert({
      'name': 'Mithril Chestplate',
      'ilvl': 5,
      'type': 'equipment',
      'slot': 'chest',
      'staminaMin': 0,
      'staminaMax': 0,
      'healthMin': 30,
      'healthMax': 50,
      'attackMin': 10,
      'attackMax': 25,
      'defenseMin': 25,
      'defenseMax': 30,
      'value': 100,
      'image': 'chest1',
      'prestigeModifier': 0.8
    });
    Item.insert({
      'name': 'Very Shiny Legplates',
      'ilvl': 2,
      'type': 'equipment',
      'slot': 'pants',
      'staminaMin': 5,
      'staminaMax': 10,
      'healthMin': 2,
      'healthMax': 5,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 3,
      'defenseMax': 6,
      'value': 20,
      'image': 'pants1',
      'prestigeModifier': 0.2
    });
    Item.insert({
      'name': 'Bright Legplates',
      'ilvl': 3,
      'type': 'equipment',
      'slot': 'pants',
      'staminaMin': 10,
      'staminaMax': 20,
      'healthMin': 5,
      'healthMax': 10,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 6,
      'defenseMax': 15,
      'value': 30,
      'image': 'pants1',
      'prestigeModifier': 0.4
    });
    Item.insert({
      'name': 'Super Legplates',
      'ilvl': 4,
      'type': 'equipment',
      'slot': 'pants',
      'staminaMin': 20,
      'staminaMax': 30,
      'healthMin': 10,
      'healthMax': 20,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 15,
      'defenseMax': 25,
      'value': 100,
      'image': 'pants1',
      'prestigeModifier': 0.5
    });
    Item.insert({
      'name': 'Mega Legplates',
      'ilvl': 6,
      'type': 'equipment',
      'slot': 'pants',
      'staminaMin': 30,
      'staminaMax': 50,
      'healthMin': 20,
      'healthMax': 40,
      'attackMin': 0,
      'attackMax': 0,
      'defenseMin': 25,
      'defenseMax': 55,
      'value': 200,
      'image': 'pants1',
      'prestigeModifier': 1.0
    });

  }
});