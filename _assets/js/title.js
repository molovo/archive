import { bind } from 'decko'

export default class Title {
  /**
   * The page title as it is when the page loads
   *
   * @type {String}
   */
  original = window.pageTitle

  /**
   * A replacement title to use when the page is hidden
   *
   * @type {String}
   */
  replacement = 'I Miss You! ❤'

  /**
   * A map of events to their respective titles
   *
   * @type {Object}
   */
  evtMap = {
    focus: this.original,
    focusin: this.original,
    pageshow: this.original,
    blur: this.replacement,
    focusout: this.replacement,
    pagehide: this.replacement
  }

  /**
   * Start your engines!
   */
  constructor () {
    // Register the visibility change listener
    document.addEventListener('visibilitychange', this.updatePageTitle)
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
      document.title = this.evtMap[evt.type]
    } else {
      // Last ditch attempt
      if (document.hidden) {
        document.title = this.replacement
      } else {
        document.title = this.original
      }
    }
  }
}
