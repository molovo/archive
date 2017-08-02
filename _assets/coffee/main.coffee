Github     = require './_github.coffee'
Projects   = require './_projects.coffee'
Title      = require './_title.coffee'
Search     = require './_search.coffee'
Turbolinks = require 'turbolinks'

document.addEventListener 'turbolinks:load', () ->
  new Github
  new Projects
  new Search

document.addEventListener 'DOMContentLoaded', () ->
  new Title
  new Github
  new Projects
  new Search

  startTurbolinks = () ->
    if not window.___browserSync___?
      Turbolinks.start()

  setTimeout startTurbolinks, 1000
