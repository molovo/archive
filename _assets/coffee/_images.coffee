###*
 * This class deals with lazy loading of images
 *
 * @type {Images}
###
module.exports = class Images
  ###*
   * Start your engines!
   *
   * @return {Images}
  ###
  constructor: () ->
    ###*
     * All images which need lazy loading
     *
     * @type {HTMLElementList}
    ###
    @images = document.querySelectorAll 'img[data-src]'

    # If IntersectionObserver is not defined, load all images immediately
    if not window.IntersectionObserver?
      return load image for image in @images

    @config =
      rootMargin: '50px 0px'
      threshold: 0.01

    ###*
     * The IntersectionObserver instance which will handle lazy loading
     *
     * @type {IntersectionObserver}
    ###
    @observer = new IntersectionObserver(@onIntersection, @config)

    @observer.observe image for image in @images

  ###*
   * Handle the intersection event
   *
   * @param {Array} entries
  ###
  onIntersection: (entries) =>
    console.log 'intersection'
    for entry in entries
      do (entry) =>
        if entry.intersectionRatio > 0
          @observer.unobserve entry.target
          @load entry.target

  ###*
   * Load an image
   *
   * @param {HTMLImageElement} image
  ###
  load: (image) =>
    image.onload = () =>
      image.removeAttribute 'data-srcset'
      image.removeAttribute 'data-src'

    if image.dataset.srcset?
      image.setAttribute 'srcset', image.dataset.srcset

    image.setAttribute 'src', image.dataset.src