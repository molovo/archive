import { bind } from 'decko'

export default class Animator {
  elements = document.querySelectorAll('.animate-on-scroll')

  opts = {
    rootMargin: '150px 0',
    threshold: [0, 1]
  }

  constructor () {
    this.observer = new IntersectionObserver(this.onIntersection, this.opts)
    this.elements.forEach(el => {
      this.observer.observe(el)
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