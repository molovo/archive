###*
 * Provides methods for handling nav
 *
 * @type {Menu}
###
module.exports = class Menu
  ###*
   * Start your engines!
   *
   * @return {Menu}
  ###
  constructor: () ->
    ###*
     * The menu
     *
     * @type {HTMLNavElement}
    ###
    @nav = document.getElementById 'menu'

    ###*
     * The nav toggle
     *
     * @type {HTMLAnchorElement}
    ###
    @toggle = document.getElementById 'nav-toggle'

    @registerNavToggleListener()

  ###*
   * Register a listener to toggle the nav
  ###
  registerNavToggleListener: () =>
    @toggle.removeEventListener 'click', @toggleMenu
    @toggle.addEventListener 'click', @toggleMenu

    document.addEventListener 'turbolinks:visit', (evt) =>
      @nav.classList.remove 'nav--open'
      document.body.classList.remove 'menu-open'

  toggleMenu: (evt) =>
    evt.preventDefault()

    if @nav.classList.contains 'nav--open'
      @nav.classList.remove 'nav--open'
      document.body.classList.remove 'menu-open'
    else
      @nav.classList.add 'nav--open'
      document.body.classList.add 'menu-open'