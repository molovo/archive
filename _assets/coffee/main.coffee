Github   = require './_github.coffee'
Projects = require './_projects.coffee'
Title    = require './_title.coffee'

window.addEventListener 'DOMContentLoaded', () ->
  new Github
  new Projects
  new Title
