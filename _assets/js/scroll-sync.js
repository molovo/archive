export default class ScrollSync {
  /**
   * A list of scroll sync targets
   *
   * @type {NodeList}
   */
  targets = document.querySelectorAll('.scroll-sync')

  /**
   * Start your engines!
   */
  constructor () {
    this.registerScrollListener()
  }

  /**
   * Register the listeners which will handle scroll syncing
   */
  registerScrollListener () {
    document.body.addEventListener('scroll', e => {
      this.targets.forEach((target) => {
        const top = target.getBoundingClientRect().top
        const height = target.clientHeight
        const child = target.querySelector('.scroll-sync__wrapper')
        const scrollHeight = child.clientHeight - height
        const h = window.innerHeight
        const y = (((h - top) / h) * (scrollHeight)) - h

        child.style.transform = `translateY(${y * -1}px)`
      })
    })
  }
}
