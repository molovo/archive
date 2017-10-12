import Fuse from 'fuse.js'
import queryString from 'query-string'
import { bind } from 'decko'

/**
 * Provides methods for searching blog posts
 *
 * @type {Search}
 */
export default class Search {
  /**
   * Options for configuring Fuse
   *
   * @type {object}
   */
  opts = {
    threshold: 0.3,
    keys: [{
      name: 'title',
      weight: 1
    }, {
      name: 'description',
      weight: 1
    }, {
      name: 'content',
      weight: 1
    }, {
      name: 'tags',
      weight: 1
    }]
  }

  /**
   * The article index in JSON form
   *
   * @type {string}
   */
  url = '/index.json'

  input = document.querySelector('#search')
  form = document.querySelector('#search-form')
  results = document.querySelector('#search-results')
  term = queryString.parse(location.search).q

  /**
   * Start your engines!
   *
   * @return {Search}
   */
  constructor () {
    if (!this.input || !this.results) {
      return
    }

    if (this.term) {
      this.handleSearch()
    }

    this.registerFormSubmitListener()
  }

  registerFormSubmitListener () {
    this.form.addEventListener('submit', this.handleSearch)
  }

  /**
   * Handle search queries
   */
  @bind
  handleSearch (evt) {
    if (evt) {
      evt.preventDefault()
    }

    this.results.innerHTML = ''

    const term = this.input.value || this.term
    this.term = term
    this.input.value = term

    this.fetchIndex()
      .then((articles) => {
        const fuse = new Fuse(articles, this.opts)
        return fuse.search(this.term)
      })
      .then((results) => {
        if (results.length === 0) {
          return this.appendNotFound()
        }

        this.appendCount(results.length)
        results.forEach(this.append)
      })
  }

  /**
   * Fetch and cache the article index
   *
   * @return {Promise}
   */
  fetchIndex () {
    return new Promise((resolve, reject) => {
      // Get the updated at timestamp
      const updatedAt = parseInt(localStorage.getItem('articles_updated_at'))
      const timestamp = new Date().getTime()

      // If we are within the cache time, get and parse the
      // cached articles list
      if ((updatedAt + 300) > timestamp) {
        const json = localStorage.getItem('articles')
        resolve(JSON.parse(json))
        return
      }

      // Fetch the list from the stored JSON file
      fetch(this.url)
        // Parse the JSON response
        .then((response) => {
          return response.json()
        })

        // Cache the response
        .then((response) => {
          localStorage.setItem('articles', JSON.stringify(response))
          localStorage.setItem('articles_updated_at', timestamp)
          return resolve(response)
        })

        // Catch parsing errors
        .catch((err) => {
          return reject(err)
        })
    })
  }

  /**
   * Append an article to the search results
   *
   * @param {object} result
   *
   * @return {void}
   */
  @bind
  append (result) {
    this.results.appendChild(this.template(result))
  }

  /**
   * Append a not found message to the search results
   *
   * @return {void}
   */
  appendNotFound () {
    const item = document.createElement('li')
    item.classList.add('search__result')
    item.classList.add('search__result--not-found')
    item.innerHTML = 'No results found'
    this.results.appendChild(item)
  }

  /**
   * Append the count of results
   *
   * @param {int} count
   *
   * @return {void}
   */
  appendCount (count = 0) {
    const item = document.createElement('li')
    item.classList.add('search__result')
    item.classList.add('search__result--count')
    item.innerHTML = `${count} results match ‘${this.input.value}’`
    this.results.appendChild(item)
  }

  /**
   * Create a DOM element for a search result
   *
   * @param {object} result
   *
   * @return {string}
   */
  template (result) {
    const item = document.createElement('li')
    item.classList.add('search__result')
    item.innerHTML = `
      <div class="post__header">
        <a href="${result.url}"
          title="${result.title}">
          <h1>${result.title}</h1>
        </a>
        <div class="post__meta">
          <date content="${result.date_xml}"
                class="post__date">
            ${result.date}
          </date>

          <ul class="post__tags">
            ${this.templateTags(result.tags)}
          </ul>
        </div>
      </div>
      `
    return item
  }

  /**
   * Create a DOM list of tags for a search result
   *
   * @param {array} tags
   *
   * @return {string}
   */
  templateTags (tags = []) {
    return tags.map((tag) => `<li class="post__tag">
      <a href="/tag/${tag}">${tag}</a>
    </li>`).join('')
  }
}
