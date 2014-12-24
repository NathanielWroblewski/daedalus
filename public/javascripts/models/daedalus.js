namespace('Labyrinth.Models')

Labyrinth.Models.Daedalus = function(options) {
  this.frontier = []
  this.visited  = []
  this.maze     = options.maze

  this.destroyWall = function(index) {
    this.maze.cells[index] = 'path'
  },

  this.isDeepWall = function(attrs) {
    return this.notNearEdge({direction: attrs.direction, index: attrs.index}) &&
      this.maze[attrs.direction](attrs.index) === 'wall' &&
      this.maze[attrs.direction]
        (this.maze['index' + this.capitalize(attrs.direction)](attrs.index)) === 'wall'
  },

  this.isWall = function(index) {
    return this.maze.cells[index] === 'wall'
  },

  this.capitalize = function(direction) {
    if (direction === 'above')   return 'Above'
    if (direction === 'below')   return 'Below'
    if (direction === 'leftOf')  return 'LeftOf'
    if (direction === 'rightOf') return 'RightOf'
  },

  this.notNearEdge = function(attrs) {
    if (attrs.direction === 'above')   var direction = 'Above'
    if (attrs.direction === 'below')   var direction = 'Below'
    if (attrs.direction === 'leftOf')  var direction = 'Left'
    if (attrs.direction === 'rightOf') var direction = 'Right'

    if (attrs.direction === 'leftOf' || attrs.direction === 'rightOf') {
      var secondIndex = this.maze['index' + direction + 'Of'](attrs.index)
        , thirdIndex  = this.maze['index' + direction + 'Of'](secondIndex)
      return !this.maze['on' + direction + 'Edge'](secondIndex) &&
             !this.maze['on' + direction + 'Edge'](thirdIndex)
    } else {
      var secondIndex = this.maze['index' + direction](attrs.index)
        , thirdIndex  = this.maze['index' + direction](secondIndex)
      return !this.maze['on' + direction + 'Edge'](secondIndex) &&
             !this.maze['on' + direction + 'Edge'](thirdIndex)
    }
  },

  this.carvePath = function() {
    var startingPoint = (this.maze.width + 1)

    this.carveEntrance()
    this.destroyWall(startingPoint)
    this.frontier = this.frontierFor(startingPoint)

    while (true) {
      var randomIndex = Math.floor(Math.random() * this.frontier.length)
        , cells = this.frontier.splice(randomIndex, 1)[0]

      if (this.isWall(cells[0]) && this.isWall(cells[1])) {
        this.destroyWall(cells[0])
        this.destroyWall(cells[1])
        this.frontier = this.frontier.concat(this.frontierFor(cells[1]))
      }

      if (this.frontier.length <= 0) break
    }

    this.carveExit()
  },

  this.carveEntrance = function(index) {
    this.destroyWall(this.maze.width)
  },

  this.carveExit = function() {
    var exit = false
    for (var i = 1; i < this.maze.height; ++i) {
      if (this.maze.cells[this.maze.total - (i * this.maze.width) - 2] === 'path') {
        this.maze.exit = this.maze.total - (i * this.maze.width) - 1
        this.destroyWall(this.maze.exit)
        exit = true
      }
      if (exit) break
    }
  },

  this.frontierFor = function(index) {
    var frontier = []

    if (this.isDeepWall({direction: 'above', index: index})) {
      var above = this.maze.indexAbove(index)
      frontier.push([above, this.maze.indexAbove(above)])
    }
    if (this.isDeepWall({direction: 'leftOf', index: index})) {
      var left = this.maze.indexLeftOf(index)
      frontier.push([left, this.maze.indexLeftOf(left)])
    }
    if (this.isDeepWall({direction: 'rightOf', index: index})) {
      var right = this.maze.indexRightOf(index)
      frontier.push([right, this.maze.indexRightOf(right)])
    }
    if (this.isDeepWall({direction: 'below', index: index})) {
      var below = this.maze.indexBelow(index)
      frontier.push([below, this.maze.indexBelow(below)])
    }

    return frontier
  }
}
