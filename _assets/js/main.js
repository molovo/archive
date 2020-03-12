import 'isomorphic-fetch'
import 'intersection-observer'
import Projects from './projects'
import Title from './title'
import Search from './search'
import Menu from './menu'
import Images from './images'
import Github from './github'
import Animator from './animator'
import ScrollSync from './scroll-sync'
import Contact from './contact'
import Turbolinks from 'turbolinks'
import VisitedLinks from './visited-links'
import { bind } from 'decko'
import Article from './article'

class App {
  /**
   * @type {object}
   */
  components = {}

  constructor() {
    this.registerComponents()
    this.registerListeners()
    this.handleLoad()
  }

  @bind
  registerComponents() {
    this.components.images = new Images()
    this.components.animator = new Animator()
    this.components.menu = new Menu()
    this.components.contact = new Contact()
    this.components.title = new Title()
    this.components.scrollSync = new ScrollSync()
    this.components.visitedLinks = new VisitedLinks()
    this.components.projects = new Projects()
    this.components.article = new Article()
  }

  @bind
  registerListeners() {
    document.addEventListener('turbolinks:visit', this.handleVisit)
    document.addEventListener('turbolinks:load', this.handleLoad)
  }

  @bind
  handleVisit(e) {
    document.documentElement.classList.add('loading')
  }

  @bind
  handleLoad(e) {
    window.github = new Github()
    window.search = new Search()

    document.documentElement.classList.remove('loading')
  }
}

Turbolinks.start()
window.app = new App()
