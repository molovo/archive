Github   = require './_github.coffee'
Projects = require './_projects.coffee'
Title    = require './_title.coffee'
Turbolinks = require 'turbolinks'

document.addEventListener 'turbolinks:load', () ->
  new Github
  new Projects

document.addEventListener 'DOMContentLoaded', () ->
  new Title
  new Github
  new Projects

  startTurbolinks = () ->
    if not window.___browserSync___?
      Turbolinks.start()

  setTimeout startTurbolinks, 250
