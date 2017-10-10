import { polyfill } from 'es6-promise'
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
import Turbolinks from 'turbolinks'

document.addEventListener('turbolinks:click', () => {
  document.documentElement.classList.add('loading')
})

document.addEventListener('turbolinks:load', () => {
  new Github()
  new Projects()
  new Search()
  new Menu()
  new Title()
  new Likes()
  new Images()
  new ScrollSync()
  new Animator()
  
  document.documentElement.classList.remove('loading')
})

polyfill()
Turbolinks.start()