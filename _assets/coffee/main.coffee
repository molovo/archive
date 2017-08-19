Github     = require './_github.coffee'
Projects   = require './_projects.coffee'
Title      = require './_title.coffee'
Search     = require './_search.coffee'
Menu       = require './_menu.coffee'
Likes      = require './_likes.coffee'
Images     = require './_images.coffee'
Turbolinks = require 'turbolinks'

document.addEventListener 'turbolinks:load', () ->
  new Github
  new Projects
  new Search
  new Menu
  new Title
  new Likes
  new Images

Turbolinks.start()