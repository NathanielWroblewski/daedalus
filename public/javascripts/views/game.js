namespace('Labyrinth.Views')

Labyrinth.Views.Game = function(options) {
  this.el  = options.el
  this.$el = $(this.el)
  this.model = options.model

  this.initialize = function() {
    this.render()
    this.placeDaedalus()
    this.placeMinotaurs()
    this.setListeners()
  },

  this.setListeners = function() {
    $(document).on('keydown', function(e) {
      // left arrow key
      if (e.keyCode === 37) this.move({character: 'daedalus', direction: 'leftOf'})
      // up arrow key
      if (e.keyCode === 38) this.move({character: 'daedalus', direction: 'above'})
      // right arrow key
      if (e.keyCode === 39) this.move({character: 'daedalus', direction: 'rightOf'})
      // down arrow key
      if (e.keyCode === 40) this.move({character: 'daedalus', direction: 'below'})
    }.bind(this))
  },

  this.placeDaedalus = function() {
    this.$el.find('div.path').first().addClass('daedalus')
  },

  this.placeMinotaurs = function() {
    var $unoccupiedPaths = this.$el.find('div.path:not(.daedalus)')
    var minotaurs = _.sample($unoccupiedPaths, 5 * Labyrinth.level)
    _.each(minotaurs, function(cell) { $(cell).addClass('minotaur') })
  },

  this.move = function(attrs) {
    var characters = $('.' + attrs.character)
    _.each(characters, function(character) {
      var index = this.$el.find('div').index($(character))
      if (this.model.canMove({from: index, direction: attrs.direction})) {
        var to = this.model.move({from: index, direction: attrs.direction})
        this.moveCharacter({character: attrs.character, to: to, from: index})
        if ($('.daedalus.minotaur').length > 0) this.daedalusDies()
        if (attrs.character === 'daedalus' && to === this.model.exit) this.endLevel()
      }
    }.bind(this))
  },

  this.endLevel = function() {
    $(document).trigger('levelup')
  },

  this.daedalusDies = function() {
    this.$el.html('<a href="/daedalus"><h2>OM NOM NOM...</h2></a>')
  },

  this.gameOver = function() {
    this.$el.html('<h2>YOU WIN!</h2><a href="/daedalus"><h2>AGAIN</h2></a>')
  },

  this.moveCharacter = function(attrs) {
    if (attrs.character === 'daedalus') {
      this.$el.find('div').removeClass(attrs.character)
    } else {
      this.$el.find('div:nth-child(' + (attrs.from + 1) + ')').removeClass('minotaur')
    }
    this.$el.find('div:nth-child(' + (attrs.to + 1) + ')').addClass(attrs.character)
  },

  this.template = function(model) {
    var template = ''
    for (var i = 0, length = model.length; i < length; ++i) {
      template += '<div class="' + model[i] + '"></div>'
    }
    return template
  },

  this.render = function() {
    this.$el.html(this.template(this.model.toJSON()))
    return this
  }
}
