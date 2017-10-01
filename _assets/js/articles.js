import { bind } from 'decko'

export default class Articles {
  articles = document.querySelectorAll('.posts__list .post')

  config = {
    rootMargin: '-150px 0px',
    threshold: 0.01
  }

  constructor (config) {
    this.config = {...this.config, ...config}

    if ('IntersectionObserver' in window) {
      this.setupArticleAnimation()
    }
  }

  setupArticleAnimation () {
    this.observer = new IntersectionObserver(this.onIntersection, this.config)

    this.articles.forEach((article) => {
      article.classList.add('fadeInUp')
      this.observer.observe(article)
    })
  }

  @bind
  onIntersection (entries) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        this.observer.unobserve(entry.target)
        entry.target.classList.add('animated')
      }
    })
  }
}
