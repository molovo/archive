import LiveNodeList from 'live-node-list'

export default class Article {
  /**
   * @type {LiveNodeList}
   */
  parallaxImages = new LiveNodeList('.post__header-image--parallax')

  constructor () {
    this.registerListeners()
  }

  registerListeners () {
    this.parallaxImages.addDelegatedEventListener(window, 'scroll', e => {
      requestAnimationFrame(t => {
        this.parallaxImages.forEach(image => {
          image.style.transform = `translate3d(-50%, ${window.pageYOffset / 2}px, 0)`
        })
      })
    }, { passive: true })
  }
}
