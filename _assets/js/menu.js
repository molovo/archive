/**
 * Provides methods for handling nav
 *
 * @type {Menu}
 */
export default class Menu {
  /**
   * The menu
   *
   * @type {HTMLNavElement}
   */
  nav = document.getElementById('menu')

  /**
   * The nav toggle
   *
   * @type {HTMLAnchorElement}
   */
  toggle = document.getElementById('nav-toggle')

  /**
   * Start your engines!
   *
   * @return {Menu}
   */
  constructor () {
    this.registerNavToggleListener()
  }

  /**
   * Register a listener to toggle the nav
   */
  registerNavToggleListener () {
    this.toggle.removeEventListener('click', this.toggleMenu.bind(this))
    this.toggle.addEventListener('click', this.toggleMenu.bind(this))

    document.addEventListener('turbolinks:visit', (evt) => {
      this.nav.classList.remove('nav--open')
      document.documentElement.classList.remove('menu-open')
    })
  }

  toggleMenu (evt) {
    evt.preventDefault()

    if (this.nav.classList.contains('nav--open')) {
      this.nav.classList.remove('nav--open')
      document.documentElement.classList.remove('menu-open')
    } else {
      this.nav.classList.add('nav--open')
      document.documentElement.classList.add('menu-open')
    }
  }
}
