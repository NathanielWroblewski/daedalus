$(document).ready(function() {
  Labyrinth.level = 1
  Labyrinth.directions = ['above', 'below', 'leftOf', 'rightOf']
  Labyrinth.pathColors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e74c3c']
  Labyrinth.wallColors = ['#16a085', '#27ae60', '#2980b9', '#8e44ad', '#f39c12', '#c0392b']

  var daedalus = new Labyrinth.Models.Daedalus({
    maze: new Labyrinth.Models.Maze({height: 49, width: 49})
  })
  daedalus.carvePath()

  var game = new Labyrinth.Views.Game({el: '.board', model: daedalus.maze})
  game.initialize()

  $(document).on('levelup', function() {
    Labyrinth.level += 1

    if (Labyrinth.level > 5) {
      game.gameOver()
    } else {
      $('.level').html(Labyrinth.level)
      daedalus.maze.initialize()
      daedalus.carvePath()

      game.model = daedalus.maze
      game.render()
      game.placeDaedalus()
      game.placeMinotaurs()
    }
  })

  setInterval(function(){
    game.move({character: 'minotaur', direction: _.sample(Labyrinth.directions)})
  }, 500)

  setInterval(function() {
    if (Labyrinth.level > 2) {
      $('.path').css('background-color', _.sample(Labyrinth.pathColors))
      $('.wall').css('background-color', _.sample(Labyrinth.wallColors))
    }
  }, 3000)
})
