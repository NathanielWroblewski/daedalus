namespace('Labyrinth.Models')

Labyrinth.Models.Maze = function(options) {
  this.cells  = []
  this.height = options.height
  this.width  = options.width
  this.total  = this.height * this.width
  this.exit   = null

  this.initialize = function() {
    this.cells = []
    for (var i = 0; i < this.total; ++i) {
      this.cells.push('wall')
    }
  },

  this.at = function(index) {
    return this.cells[index]
  },

  this.indexAbove = function(index) {
    return index - this.width
  },

  this.indexLeftOf = function(index) {
    return index - 1
  },

  this.indexRightOf = function(index) {
    return index + 1
  },

  this.indexBelow = function(index) {
    return index + this.width
  },

  this.onAboveEdge = function(index) {
    return index < this.width
  },

  this.onBelowEdge = function(index) {
    return index > (this.total - this.width)
  },

  this.onLeftEdge = function(index) {
    return index % this.width === 0
  },

  this.onRightEdge = function(index) {
    return index % this.width === this.width - 1
  },

  this.above = function(index) {
    return this.cells[this.indexAbove(index)]
  },

  this.leftOf = function(index) {
    return this.cells[this.indexLeftOf(index)]
  },

  this.rightOf = function(index) {
    return this.cells[this.indexRightOf(index)]
  },

  this.below = function(index) {
    return this.cells[this.indexBelow(index)]
  },

  this.canMove = function(attrs) {
    return this[attrs.direction](attrs.from) === 'path'
  },

  this.move = function(attrs) {
    return this['index' + this.capitalize(attrs.direction)](attrs.from)
  },

  this.capitalize = function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  },

  this.toJSON = function() {
    return this.cells
  }

  this.initialize()
}
