import LiveNodeList from 'live-node-list'

export default class Article {
  slugs = [
    'the-view-from-above',
    'lost-at-sea'
  ]

  /**
   * @type {LiveNodeList}
   */
  parallaxImages = new LiveNodeList(this.slugs.map(slug => `.page--${slug} .post__header-image`).join(', '))

  constructor () {
    this.registerListeners()
  }

  registerListeners () {
    this.parallaxImages.addDelegatedEventListener(window, 'scroll', e => {
      requestAnimationFrame(t => {
        this.parallaxImages.forEach(image => {
          image.style.transform = `translate3d(-50%, ${window.pageYOffset / 4}px, 0)`
        })
      })
    }, { passive: true })
  }
}
