import LiveNodeList from 'live-node-list'
import { bind } from 'decko'

/**
 * Provides methods for filtering projects by language
 *
 * @type {Projects}
 */
export default class Projects {
  filterLinks = new LiveNodeList('.projects__filter a')
  filterItems = new LiveNodeList('.projects__project a')

  /**
   * Start your engines!
   *
   * @return {Projects}
   */
  constructor () {
    this.registerFilteringListeners()
  }

  /**
   * Register listeners on filtering links which handle click events
   */
  registerFilteringListeners () {
    this.filterLinks.addEventListener('click', this.filterResults)
  }

  /**
   * Filter the results when a click event is received
   *
   * @param  {HTMLEvent} evt The click event
   */
  @bind
  filterResults (evt) {
    // Prevent the default click handler
    evt.preventDefault()

    // Get the language of the clicked links
    const language = evt.target.dataset.target

    // Loop through each of the links and remove the active class
    this.filterLinks.forEach((link) => {
      if (link !== evt.target) {
        link.classList.remove('active')
      }
    })

    // Add the active class to the clicked link
    evt.target.classList.add('active')

    // Loop through each of the project tiles
    this.filterItems.forEach((item) => {
      // If the selected language is all, display all tiles
      if (language === 'all') {
        item.parentNode.style.display = 'block'
        return
      }

      // If the tile's language matches the selected language,
      // show the tile
      if (item.dataset.language === language) {
        item.parentNode.style.display = 'block'
        return
      }

      // The tile matches nothing, hide it
      item.parentNode.style.display = 'none'
    })
  }
}
