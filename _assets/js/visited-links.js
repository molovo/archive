import LiveNodeList from 'live-node-list'
import { bind } from 'decko'

export default class VisitedLinks {
  /**
   * Links to featured items on the homepage
   *
   * @type {NodeList}
   */
  links = new LiveNodeList('.homepage-section__link')

  /**
   *
   */
  constructor () {
    this.links.on('update', (newItems, oldItems) => {
      newItems.forEach(link => {
        // Don't include external links
        if (localStorage.getItem(`visited-${link.href}`)) {
          link.dataset.visited = true
        }
      })
    })

    this.links.addEventListener('click', this.markVisited)
  }

  /**
   * Mark a link as visited when clicked
   *
   * @param {ClickEvent} e
   */
  @bind
  markVisited (e) {
    const link = e.target
    localStorage.setItem(`visited-${link.href}`, true)
  }
}
