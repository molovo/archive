Fuse = require 'fuse.js'
queryString = require 'query-string'

require('es6-promise').polyfill()
require 'isomorphic-fetch'

###*
 * Provides methods for searching blog posts
 *
 * @type {Search}
###
module.exports = class Search
  ###*
   * Options for configuring Fuse
   *
   * @type {object}
  ###
  OPTIONS =
    threshold: 0.3
    keys: [{
      name: 'title'
      weight: 1
    }, {
      name: 'description'
      weight: 1
    }, {
      name: 'content'
      weight: 1
    }, {
      name: 'tags'
      weight: 1
    }]

  ###*
   * The article index in JSON form
   *
   * @type {string}
  ###
  URL = '/index.json'

  ###*
   * Start your engines!
   *
   * @return {Search}
  ###
  constructor: () ->
    @input = document.querySelector '#search'
    @form = document.querySelector '#search-form'
    @results = document.querySelector '#search-results'
    @term = queryString.parse(location.search).q

    return if not @input? or not @results?

    if @term?
      @handleSearch()

    @registerFormSubmitListener()

  registerFormSubmitListener: () =>
    @form.addEventListener 'submit', @handleSearch

  ###*
   * Handle search queries
  ###
  handleSearch: (evt) =>
    evt.preventDefault() if evt?
    @results.innerHTML = ''
    term = @input.value or @term
    @term = term
    @input.value = term

    @fetchIndex()
      .then (articles) =>
        console.log articles
        fuse = new Fuse(articles, OPTIONS)
        fuse.search @term
      .then (results) =>
        @appendNotFound() if results.length is 0
        @append(result) for result in results

  ###*
   * Fetch and cache the article index
   *
   * @return {Promise}
  ###
  fetchIndex: () =>
    new Promise (resolve, reject) ->
      # Get the updated at timestamp
      updatedAt = parseInt localStorage.getItem('articles_updated_at')
      timestamp = new Date().getTime()

      # If we are within the cache time, get and parse the
      # cached articles list
      if (updatedAt + 300) > timestamp
        json = localStorage.getItem 'articles'
        resolve JSON.parse(json)
        return

      # Fetch the list from the stored JSON file
      fetch URL
        # Parse the JSON response
        .then (response) ->
          response.json()

        # Cache the response
        .then (response) ->
          localStorage.setItem 'articles', JSON.stringify(response)
          localStorage.setItem 'articles_updated_at', timestamp
          resolve response

        # Catch parsing errors
        .catch (err) ->
          reject err

  ###*
   * Append an article to the search results
   *
   * @param {object} result
   *
   * @return {void}
  ###
  append: (result) =>
    @results.appendChild @template(result)

  ###*
   * Append a not found message to the search results
   *
   * @return {void}
  ###
  appendNotFound: () =>
    item = document.createElement 'li'
    item.classList.add 'search__result'
    item.classList.add 'search__result--not-found'
    item.innerHTML = 'No results found'
    @results.appendChild item

  ###*
   * Create a DOM element for a search result
   *
   * @param {object} result
   *
   * @return {string}
  ###
  template: (result) =>
    item = document.createElement 'li'
    item.classList.add 'search__result'
    item.innerHTML = """
      <div class="post__header">
        <a href="#{result.url}"
          title="#{result.title}">
          <h1>#{result.title}</h1>
        </a>
        <div class="post__meta">
          <date content="#{result.date_xml}"
                class="post__date">
            #{result.date}
          </date>

          <ul class="post__tags">
            #{@templateTags(result.tags)}
          </ul>
        </div>
      </div>
      """
    item

  ###*
   * Create a DOM list of tags for a search result
   *
   * @param {array} tags
   *
   * @return {string}
  ###
  templateTags: (tags = []) =>
    result = for tag in tags
      """<li class="post__tag"><a href="/tag/#{tag}">#{tag}</a></li>"""
    result.join('')