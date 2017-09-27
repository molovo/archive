require 'intersection-observer'
Swiper = require 'swiper'

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
    @images = document.querySelectorAll 'img[data-src], picture source[data-srcset]'

    # Setup swiper instances
    @setupSwipers()

    # If IntersectionObserver is defined, set up lazy loading
    if window.IntersectionObserver?
      return @lazyLoadImages()

    # If IntersectionObserver is not defined, load all images immediately
    @load image for image in @images

  ###*
   * Setup the IntersectionObserver instance which will
   * trigger image loading
  ###
  lazyLoadImages: () =>
    @config =
      rootMargin: '-50px 0px'
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
    image.onload = () ->
      requestAnimationFrame () ->
        image.removeAttribute 'data-src'
        image.removeAttribute 'data-srcset'

    if image.srcset? and image.dataset.srcset?
      image.srcset = image.dataset.srcset
    else
      image.src = image.dataset.src

  setupSwipers: () =>
    base = parseInt(window.getComputedStyle(document.body).fontSize.replace('px', '')) * 1.5

    swiper = new Swiper('.swiper-container', {
      loop: false
      grabCursor: true
      nextButton: '.swiper-button-next'
      prevButton: '.swiper-button-prev'
      spaceBetween: base * 2
      slideToClickedSlide: true
      onSlideChangeEnd: (swiper) =>
        figure    = swiper.container[0].parentNode
        indicator = figure.querySelector '.swiper-current'

        if indicator?
          indicator.innerHTML = ++swiper.realIndex
    })