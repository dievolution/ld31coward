Meteor.startup(function () {
  //create player if new
  if (!localStorage.getItem("playerId")) {
    Meteor.call("createPlayer", function(err, data) {
      Session.set("playerId", data);
      localStorage.setItem("playerId", data);
      uuid = data;
      player = Player.findOne(uuid);
      hero = Hero.findOne(player.hero);

      //ask for name if not set in player
      if (!player.name) {
        $("#introDialog").modal({
          'backdrop': 'static'
        });
      }
    });
  } else {
    Session.set("playerId", localStorage.getItem("playerId"));
    uuid = Session.get("playerId");
  }
});

Template.registerHelper(
"player", function() {
  player = Player.findOne(localStorage.getItem("playerId"));
  return player;
})

Template.registerHelper(
"hero", function() {
  var player = Player.findOne(localStorage.getItem("playerId"));
  if (player) {
    hero = Hero.findOne(player.hero);
    return hero;
  }
})

Template.headerscripts.rendered = function() {
  appendScript("/js/bootstrap.min.js");
  appendScript("/js/jquery-ui.min.js", function() {
    Template.stockpile.droppable();
    Template.inventory.droppable();
    Template.vendor.droppable();
    Template.hero.droppable();
    Template.headerscripts.afterLoad();
  });
}

Template.headerscripts.afterLoad = function() {
  var popOverSettings = {
    placement: 'left',
    container: 'body',
    trigger: 'hover',
    html: true,
    selector: '.item.popoverItem'
  }
  $('body').popover(popOverSettings);
  $('body').on("click", ".popover-content", function() {
    $(this).parent().remove();
  })
  $('body').on("mousedown", ".item", function() {
    $(".popover").remove();
  });

  Meteor.call("startPrestigeCount", uuid);

  var testInterval = setInterval(function() {
      if (Player.findOne(uuid)) {
        clearInterval(testInterval);
        player = Player.findOne(uuid);
        hero = Hero.findOne(player.hero);
        //ask for name if not set in player
        if (!player.name) {
          $("#introDialog").modal({
            'backdrop': 'static'
          });
        }
      }
    }, 100)

  $('#introDialog').on('hide.bs.modal', function (e) {
    if ($("#introDialog input").val() != "") {
      Player.update(player._id, { $set: {'name': $("#introDialog input").val()}});
    }
  })
}

function appendScript(pathToScript, callback) {
    var head = document.getElementsByTagName("head")[0];
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = pathToScript;
    head.appendChild(js);
    js.onload = callback;
}