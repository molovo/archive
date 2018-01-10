import { bind } from "decko";

export default class VisitedLinks {
  /**
   * Links to featured items on the homepage
   *
   * @type {NodeList}
   */
  links = document.querySelectorAll('.homepage-section__link')

  /**
   *
   */
  constructor () {
    if (this.links.length === 0) {
      return
    }

    this.links.forEach(link => {
      // Don't include external links
      if (localStorage.getItem(`visited-${link.href}`)) {
        link.dataset.visited = true
      }

      link.addEventListener('click', this.markVisited)
    })
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