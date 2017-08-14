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
    @toggle.addEventListener 'click', (evt) =>
      evt.preventDefault()
      @nav.classList.toggle 'nav--open'
      document.body.classList.toggle 'menu-open'

    document.addEventListener 'turbolinks:visit', (evt) =>
      @nav.classList.remove 'nav--open'