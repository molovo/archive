import { bind } from 'decko'

export default class Title {
  /**
   * The page title as it is when the page loads
   *
   * @type {string}
   */
  original = window.pageTitle

  /**
   * The page title currently in use
   *
   * @type {string}
   */
  current = this.original

  /**
   * A replacement title to use when the page is hidden
   *
   * @type {string}
   */
  replacement = 'I Miss You! ❤'

  /**
   * A list of elements which update the title
   *
   * @type {NodeList}
   */
  titleElements = document.querySelectorAll('[data-title]')

  /**
   * The current title in the header
   */
  headerTitle = document.querySelector('.header__title')

  /**
   * A map of events to their respective titles
   *
   * @type {object}
   */
  evtMap = {
    focus: 'current',
    focusin: 'current',
    pageshow: 'current',
    blur: 'replacement',
    focusout: 'replacement',
    pagehide: 'replacement'
  }

  /**
   * Start your engines!
   */
  constructor () {
    // Register the visibility change listener
    window.addEventListener('scroll', this.findCorrectTitle)
    document.addEventListener('visibilitychange', this.updatePageTitle)
  }

  /**
   * Find the correct title based on the current scroll position
   *
   * @param {ScrollEvent} e
   */
  @bind
  findCorrectTitle (e) {
    let set = false

    // Loop through each of the elements with titles
    for (var i = 0; i < this.titleElements.length; i++) {
      const el = this.titleElements[i]
      if (this.isInViewport(el)) {
        const title = el.dataset.title
        this.current = title
        document.title = title
        this.headerTitle.innerHTML = title
        set = true
        break
      }
    }

    if (!set) {
      this.current = this.original
      document.title = this.original
      this.headerTitle.innerHTML = ''
    }
  }

  /**
   * Update the page's title based on its visibility
   *
   * @param  {Event} evt The visibility change event
   */
  @bind
  updatePageTitle (evt) {
    evt = evt || window.event

    // If the event type exists in the map, set the right title
    if (evt.type in this.evtMap) {
      document.title = this[this.evtMap[evt.type]]
    } else {
      // Last ditch attempt
      if (document.hidden) {
        document.title = this.replacement
      } else {
        document.title = this.current
      }
    }
  }

  /**
   * Check if an element is currently within the viewport
   *
   * @return {bool}
   */
  isInViewport (el) {
    if (window.pageYOffset < 300) {
      return false
    }

    const {top, left, bottom, right} = el.getBoundingClientRect()

    return top <= (window.innerHeight / 2) &&
            bottom >= (window.innerHeight / 2) &&
            left <= (window.innerWidth / 2) &&
            right >= (window.innerWidth / 2)
  }
}
