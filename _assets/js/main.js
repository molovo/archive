import 'babel-polyfill'
import 'isomorphic-fetch'
import 'intersection-observer'
import Projects from './projects'
import Title from './title'
import Search from './search'
import Menu from './menu'
import Likes from './likes'
import Images from './images'
import Github from './github'
import Animator from './animator'
import ScrollSync from './scroll-sync'
import Contact from './contact'
import Turbolinks from 'turbolinks'

const start = () => {
  window.github = new Github()
  window.projects = new Projects()
  window.search = new Search()
  window.menu = new Menu()
  window.title = new Title()
  window.likes = new Likes()
  window.images = new Images()
  window.scrollSync = new ScrollSync()
  window.animator = new Animator()
  window.contact = new Contact()

  document.documentElement.classList.remove('loading')
}

document.addEventListener('turbolinks:load', start)

document.addEventListener('turbolinks:click', () => {
  document.documentElement.classList.add('loading')
})

Turbolinks.start()
start()
