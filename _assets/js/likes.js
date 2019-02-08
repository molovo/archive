import LiveNodeList from 'live-node-list'
import { bind } from 'decko'

/**
 * A class for handling likes of blog posts
 *
 * @type {Likes}
 */
export default class Likes {
  /**
   * All like links on the current page
   *
   * @type {HTMLElementList}
   */
  links = new LiveNodeList('.social__link--like')

  /**
   * Default parameters for XHR requests
   *
   * @type {object}
   */
  requestParams = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  /**
   * Start your engines!
   *
   * @return {Likes}
   */
  constructor () {
    this.links.on('update', (newItems, oldItems) => {
      newItems.forEach((link) => {
        // If a like has already been recorded, update the icon
        if (this.isLiked(link)) {
          link.classList.add('social__link--liked')
        }

        // Get the number of likes for this URL
        this.getCount(link)
          .then(this.updateCount.bind(this, link))
      })
    })

    // Add an event listener to handle likes
    this.links.addEventListener('click', this.handleLikeAction)
  }

  /**
   * Handle a click on a like button
   *
   * @param {Event} evt
   */
  @bind
  handleLikeAction (evt) {
    evt.preventDefault()
    const link = evt.currentTarget

    if (this.isLiked(link)) {
      this.unlike(link)
    } else {
      this.like(link)
    }
  }

  /**
   * Check if a like has already been recorded for a link
   *
   * @param {HTMLAnchorElement} link
   */
  isLiked (link) {
    return localStorage.getItem(`posts.liked.${link.dataset.url}`) === 'true'
  }

  /**
   * Get the like count for a link
   *
   * @param {HTMLAnchorElement} link
   *
   * @return {Promise}
   */
  getCount (link) {
    return new Promise((resolve, reject) => {
      fetch(`https://like.molovo.co?url=${link.dataset.url}`)
        .then(this.parseJson)
        .then((response) => resolve(response.likes))
    })
  }

  /**
   * Update the displayed count for a link
   *
   * @param {HTMLAnchorElement} link
   * @param {integer}           count
   */
  updateCount (link, count) {
    const el = link.querySelector('.social__likes')
    if (!el) {
      return
    }

    if (count) {
      el.innerHTML = count
      return
    }

    el.innerHTML = '0'
  }

  /**
   * Like a link
   *
   * @param {HTMLAnchorElement} link
   */
  like (link) {
    const params = this.requestParams
    params.body = JSON.stringify({ url: link.dataset.url })

    fetch('https://like.molovo.co', params)
      .then(this.parseJson)
      .then((response) => {
        if (response.success) {
          link.classList.add('social__link--liked')
          localStorage.setItem(`posts.liked.${link.dataset.url}`, true)

          this.getCount(link)
            .then(this.updateCount.bind(this, link))
        }
      })
  }

  /**
   * Unlike a link
   *
   * @param {HTMLAnchorElement} link
   */
  unlike (link) {
    const params = this.requestParams
    params.body = JSON.stringify({
      url: link.dataset.url,
      unlike: true
    })

    fetch('https://like.molovo.co', params)
      .then(this.parseJson)
      .then((response) => {
        if (response.success) {
          link.classList.remove('social__link--liked')
          localStorage.removeItem(`posts.liked.${link.dataset.url}`)

          this.getCount(link)
            .then(this.updateCount.bind(this, link))
        }
      })
  }

  /**
   * Parse a JSON response from fetch
   *
   * @param {Response} response
   *
   * @return {Promise<object>}
   */
  parseJson (response) {
    return response.json()
  }
}
