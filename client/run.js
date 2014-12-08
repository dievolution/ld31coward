// Dungeon

Template.run.helpers({
  depth: function () {
    return 0;
  },
  currentDungeonTime: function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      var dungeon = Dungeon.findOne({"playerId": player._id});
      if (dungeon) return dungeon.dungeontime;
    }
  }
});

Template.run.events({
  'click .dungeonEntrance': function (event, template) {
    Session.set('dungeon_time', 0);
    if (player.currentDungeon) {
      Meteor.call('stopDungeon', player._id);
      $(".container").removeClass("inDungeon");
      $(".hero").animate({
        "margin-top": "+=250"
      }, 500, function() {
        $(".hero .equipmentslot").show();
      })
    } else {
      Meteor.call('startDungeon', player._id);
      //also, update shop
      player.updateShopItems();
      $(".hero .equipmentslot").hide();
      $(".hero").animate({
        "margin-top": "-=250"
      }, 500, function() {
        $(".container").addClass("inDungeon");
        // setInterval(function() {
        //   $(".progressBox:not(.heroprogress)").animate({
        //     "left": "-=51"
        //   }, 2950)
        // }, 3000);
      })
    }
  }
});

Template.progress.helpers({
  dungeonProgress: function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      var dungeon = Dungeon.findOne({"playerId": player._id});
      if (dungeon) {
        return dungeon.nextRooms();
      }
    }
  },
  staminapercentage: function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      var hero = player.getHero();
      return hero.stamina / hero.staminaMax * 100
    }
  }
  ,
  healthpercentage: function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      var hero = player.getHero();
      return hero.health / hero.healthMax * 100
    }
  },
  roomsCount: function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      var dungeon = Dungeon.findOne({"playerId": player._id});
      if (dungeon) {
        return dungeon.rooms.length - 1;
      }
    }
  },
  roomsCleared: function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      var dungeon = Dungeon.findOne({"playerId": player._id});
      if (dungeon) {
        return dungeon.rooms.length - dungeon.roomsLeft();
      }
    }
  },
  roomsclearedpercentage: function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      var dungeon = Dungeon.findOne({"playerId": player._id});
      if (dungeon) {
        return (dungeon.rooms.length - 1 - dungeon.roomsLeft()) / (dungeon.rooms.length - 1) * 100;
      }
    }
  }
})

// Inventories

Template.stockpile.helpers({
  'stockpileStash': function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      return player.stockpile;
    }
  }
})

Template.inventory.helpers({
  'inventoryStash': function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      return player.inventory;
    }
  }
})

Template.vendor.helpers({
  'shopStash': function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      return player.vendor;
    }
  }
})

Template.item.helpers({
  'statsChange': function(data) {
    var data = data["hash"];
    if (data.slot == "head") data.slot = "itemHead";
    if (data.slot == "lhand") data.slot = "itemLeftHand";
    if (data.slot == "rhand") data.slot = "itemRightHand";
    if (data.slot == "chest") data.slot = "itemChest";
    if (data.slot == "pants") data.slot = "itemPants";
    if (data.typ == "stamina") data.typ = "stamina";
    if (data.typ == "health") data.typ = "health";
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      var hero = player.getHero();
      var slot = hero[data.slot];
      var current = 0;
      if (slot) {
        current = slot[data.typ];
      }
      if (!current) current = 0;
      if ( current > data.value) {
        return "<span class='minus'> - " + Math.abs(data.value - current) + "</span";
      } else if ( current < data.value) {
        return "<span class='plus'> + " + Math.abs(data.value - current) + "</span";
      } else {
        return "<span class='equal'>0</span";
      }
    }
  }
})

Template.item.events({
  'click .inChest': function (event, template) {
    player = Player.findOne(Session.get("playerId"));
    var id = $(event.target).attr("id");
    player.removeChest(id);
  }
});

Template.vendor.events({
  'mouseenter .vendor .item': function(event, template) {
    player = Player.findOne(Session.get("playerId"));
    if (player.gold < $(event.target).attr("data-price")) {
      setTimeout(function() {$(event.target).draggable("disable")},100);
    } else {
      setTimeout(function() {$(event.target).draggable("enable")},100);
    }
  }
});

Template.stockpile.droppable = function() {
}

Template.inventory.droppable = function() {
  if (jQuery && jQuery.ui) {
    $(".inventory").droppable({
      accept: ".stockpile .item, .equipmentslot .item, .vendor .item",
      drop: function(event, ui) {
        if (ui.draggable.parent().attr("data-dragfrom") == "stockpile")
          Meteor.call("moveToInventory", ui.draggable.attr("id"), ui.draggable.parent().attr("data-dragfrom"), Session.get("playerId"));
        else if (ui.draggable.parent().attr("data-dragfrom") == "equipmentslot") {
          Meteor.call("unequip", ui.draggable.attr("id"), ui.draggable.parent().attr("data-dragfrom"), Session.get("playerId"));
        } else if (ui.draggable.parent().attr("data-dragfrom") == "vendor") {
          Meteor.call("moveToInventory", ui.draggable.attr("id"), ui.draggable.parent().attr("data-dragfrom"), Session.get("playerId"));
        }
      }
    });
  }
}

Template.vendor.droppable = function() {
  if (jQuery && jQuery.ui) {
    $(".vendor").droppable({
      accept: ".stockpile .item, .inventory .item",
      drop: function(event, ui) {
        Meteor.call("sellItem", ui.draggable.attr("id"), ui.draggable.parent().attr("data-dragfrom"), Session.get("playerId"));
      }
    });
  }
}

Template.hero.droppable = function() {
  if (jQuery && jQuery.ui) {
    $(".equipmentslot").droppable({
      accept: ".stockpile .item, .inventory .item",
      drop: function(event, ui) {
        Meteor.call("equip", ui.draggable.attr("id"), ui.draggable.parent().attr("data-dragfrom"), Session.get("playerId"));
      }
    });
  }
}

Template.item.rendered = function() {
  $(document).off("mouseenter", ".item").on("mouseenter", ".item", function(e) {
    var item = $(this);
    if (!item.is('ui-draggable') && !item.hasClass("inChest"))
      item.draggable({
        stack: ".item",
        revert: true,
        start: function() {
          $(".popover").remove();
          if ($(".inventory .item").length >= 16) {
            $(".inventory").droppable("disable")
          } else {
            $(".inventory").droppable("enable");
          }

          $(".equipmentslot").each(function(idx, item) {
            if ($(item).find(".item").length > 0) {
              $(item).droppable("disable");
            } else {
              $(item).droppable("enable");
            }
          })
        },
        stop: function() {
          $(".popover").remove();
        }
      });
  })
}

//Prestige

Template.main.helpers({
  'prestigeIncrease': function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      return (player.prestigeModifier * player.prestigeInc * (player.dungeonDifficulty/10) * 12).toFixed(2);
    }
  }
})

Template.prestige.helpers({
  'prestigePrice': function() {
    player = Player.findOne(Session.get("playerId"));
    if (player) {
      return player.prestigeInc * 100;
    }
  }
})

Template.prestige.events({
  'click button': function() {
    player = Player.findOne(Session.get("playerId"));
    if (player && player.gold > player.prestigeInc * 100) {
      Player.update(player._id, { $set: {
        "prestigeInc": player.prestigeInc + 1,
        "gold": player.gold - player.prestigeInc * 100
      }});
      Meteor.call("startPrestigeCount", Session.get("playerId"));
    }
  }
})

//highscores
Template.highscores.helpers({
  highscores: function () {
    return Player.find({}, {limit: 100, sort: {prestige: -1}}).fetch();
  }
});