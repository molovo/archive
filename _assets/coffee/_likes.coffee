###*
 * A class for handling likes of blog posts
 *
 * @type {Likes}
###
module.exports = class Likes
  ###*
   * Start your engines!
   *
   * @return {Likes}
  ###
  constructor: () ->
    ###*
     * All like links on the current page
     *
     * @type {HTMLElementList}
    ###
    @links = document.querySelectorAll '.post__social__link--like'

    ###*
     * Default parameters for XHR requests
     *
     * @type {object}
    ###
    @requestParams =
      method: 'POST'
      headers: {
        'Content-Type': 'application/json'
      }

    for link in @links
      do (link) =>
        # If a like has already been recorded, update the icon
        if @isLiked link
          link.classList.add 'post__social__link--liked'

        # Get the number of likes for this URL
        @getCount link
          .then @updateCount.bind(@, link)

        # Add an event listener to handle likes
        link.addEventListener 'click', @handleLikeAction

  ###*
   * Handle a click on a like button
   *
   * @param {Event} evt
  ###
  handleLikeAction: (evt) =>
    evt.preventDefault()
    link = evt.currentTarget

    if @isLiked link
      @unlike link
    else
      @like link

  ###*
   * Check if a like has already been recorded for a link
   *
   * @param {HTMLAnchorElement} link
  ###
  isLiked: (link) =>
    localStorage.getItem("posts.liked.#{link.dataset.url}") is "true"

  ###*
   * Get the like count for a link
   *
   * @param {HTMLAnchorElement} link
   *
   * @return {Promise}
  ###
  getCount: (link) =>
    new Promise (resolve, reject) =>
      fetch "https://like.molovo.co?url=#{link.dataset.url}"
        .then @parseJson
        .then (response) =>
          resolve response.likes

  ###*
   * Update the displayed count for a link
   *
   * @param {HTMLAnchorElement} link
   * @param {integer}           count
  ###
  updateCount: (link, count) =>
    el = link.querySelector '.post__social__likes'
    return if not el?

    if count
      el.innerHTML = count
      return

    el.innerHTML = ''

  ###*
   * Like a link
   *
   * @param {HTMLAnchorElement} link
  ###
  like: (link) =>
    params = @requestParams
    params.body = JSON.stringify(url: link.dataset.url)

    fetch 'https://like.molovo.co', params
      .then @parseJson
      .then (response) =>
        if response.success
          link.classList.add 'post__social__link--liked'
          localStorage.setItem "posts.liked.#{link.dataset.url}", true

          @getCount link
            .then @updateCount.bind(@, link)

  ###*
   * Unlike a link
   *
   * @param {HTMLAnchorElement} link
  ###
  unlike: (link) =>
    params = @requestParams
    params.body = JSON.stringify(
      url: link.dataset.url
      unlike: true
    )

    fetch 'https://like.molovo.co', params
      .then @parseJson
      .then (response) =>
        if response.success
          link.classList.remove 'post__social__link--liked'
          localStorage.removeItem "posts.liked.#{link.dataset.url}"

          @getCount link
            .then @updateCount.bind(@, link)

  ###*
   * Parse a JSON response from fetch
   *
   * @param {Response} response
   *
   * @return {object}
  ###
  parseJson: (response) =>
    response.json()