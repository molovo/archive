module.exports = class Articles
  constructor: () ->
    @articles = document.querySelectorAll('.posts__list .post')

    if window.IntersectionObserver?
      @setupArticleAnimation()

  setupArticleAnimation: () =>
    config =
      rootMargin: '-150px 0px'
      threshold: 0.01

    @observer = new IntersectionObserver @onIntersection, config

    for article in @articles
      do (article) =>
        article.classList.add 'fadeInUp'
        @observer.observe article

  onIntersection: (entries) =>
    for entry in entries
      do (entry) =>
        if entry.intersectionRatio > 0
          @observer.unobserve entry.target
          entry.target.classList.add 'animated'