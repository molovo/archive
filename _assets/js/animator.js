import LiveNodeList from 'live-node-list'
import { bind } from 'decko'

export default class Animator {
  elements = new LiveNodeList('.animate-on-scroll')

  opts = {
    rootMargin: '150px 0px',
    threshold: [0, 1]
  }

  constructor () {
    this.observer = new IntersectionObserver(this.onIntersection, this.opts)
    this.elements.on('update', (newItems, oldItems) => {
      oldItems.forEach(item => this.observer.unobserve(item))
      newItems.forEach(item => this.observer.observe(item))
    })
  }

  @bind
  onIntersection (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        this.observer.unobserve(entry.target)
        entry.target.classList.add('animated')
      }
    })
  }
}
