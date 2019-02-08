import { bind } from 'decko'
import MagicRoundabout from 'magic-roundabout'
import LiveNodeList from 'live-node-list'

/**
 * This class deals with lazy loading of images
 *
 * @type {Images}
 */
export default class Images {
  /**
   * The images to be lazy loaded
   *
   * @type {NodeList}
   */
  images = new LiveNodeList('img[data-src], picture source[data-srcset]')

  /**
   * The IntersectionObserver config
   *
   * @type {object}
   */
  config = {
    rootMargin: '-150px -150px',
    threshold: 0.01
  }

  /**
   * An array in which slideshow instances are stored
   *
   * @type {Slideshow[]}
   */
  slideshows = new LiveNodeList('.slideshow')

  /**
   * Start your engines!
   *
   * @return {Images}
   */
  constructor () {
    // Setup slideshow instances
    this.setupSlideshows()
    this.lazyLoadImages()
  }

  /**
   * Setup the IntersectionObserver instance which will
   * trigger image loading
   */
  lazyLoadImages () {
    /**
     * The IntersectionObserver instance which will handle lazy loading
     *
     * @type {IntersectionObserver}
     */
    this.observer = new IntersectionObserver(this.onIntersection, this.config)

    this.images.forEach((image) => {
      if (image.dataset.loadInstantly) {
        this.load(image)
        return
      }

      this.observer.observe(image)
    })
    this.images.on('update', (newItems, oldItems) => {
      oldItems.forEach(image => this.observer.unobserve(image))
      newItems.forEach(image => {
        if (image.dataset.loadInstantly) {
          this.load(image)
          return
        }

        this.observer.observe(image)
      })

      this.setupSlideshows()
    })
  }

  /**
   * Handle the intersection event
   *
   * @param {Array} entries
   */
  @bind
  onIntersection (entries) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        this.observer.unobserve(entry.target)
        this.load(entry.target)
      }
    })
  }

  /**
   * Load an image
   *
   * @param {HTMLImageElement} image
   */
  load (image) {
    image.onload = () => {
      requestAnimationFrame(() => {
        image.removeAttribute('data-src')
        image.removeAttribute('data-srcset')
        image.removeAttribute('data-type')
      })
    }

    if ('type' in image.dataset) {
      image.type = image.dataset.type
    }

    if ('srcset' in image && 'srcset' in image.dataset) {
      image.srcset = image.dataset.srcset
    } else if ('src' in image.dataset) {
      image.src = image.dataset.src
    }
  }

  setupSlideshows () {
    this.slideshows.forEach(this.createSlideshow)
    this.slideshows.on('update', (newItems, oldItems) => {
      newItems.forEach(this.createSlideshow)
    })
  }

  @bind
  createSlideshow (container) {
    if ('magicRoundabout' in container && container.magicRoundabout instanceof MagicRoundabout) {
      return
    }

    container.magicRoundabout = new MagicRoundabout(container, {
      draggable: true,
      onChange: (slideshow) => {
        const figure = slideshow.container.parentNode
        const indicator = figure.querySelector('.slideshow__current')

        if (indicator) {
          indicator.innerHTML = slideshow.current
        }
      }
    })
  }
}
