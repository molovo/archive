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
    // Register the visibility change listeners
    this.registerListeners()
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

  /**
   * Register listeners for changes in page visibility.
   * There are lots, but hopefully this means it will work
   * in all browsers.
   */
  registerListeners () {
    // This sets the appropriate listeners so that everything works cross browser
    let hidden = 'hidden'

    // Standards:
    if (hidden in document) {
      document.addEventListener('visibilitychange', this.updatePageTitle)
    } else if ((hidden = 'mozHidden') in document) {
      document.addEventListener('mozvisibilitychange', this.updatePageTitle)
    } else if ((hidden = 'webkitHidden') in document) {
      document.addEventListener('webkitvisibilitychange', this.updatePageTitle)
    } else if ((hidden = 'msHidden') in document) {
      document.addEventListener('msvisibilitychange', this.updatePageTitle)
    // IE 9 and lower:
    } else if ('onfocusin' in document) {
      document.onfocusin = this.updatePageTitle
      document.onfocusout = this.updatePageTitle
    // All others:
    } else {
      window.onpageshow = this.updatePageTitle
      window.onpagehide = this.updatePageTitle
      window.onfocus = this.updatePageTitle
      window.onblur = this.updatePageTitle
    }
  }
}
