import { bind } from 'decko'

export default class Contact {
  /**
   * The link to open the contact form
   *
   * @type {HTMLAnchorElement}
   */
  link = document.getElementById('open-contact-form')

  /**
   * The contact form popup
   *
   * @type {HTMLDivElement}
   */
  popup = document.getElementById('contact-popup')

  /**
   * The contact form
   *
   * @type {HTMLFormElement}
   */
  form = this.popup.querySelector('.contact__form')

  /**
   * The contact content
   *
   * @type {HTMLFormElement}
   */
  content = this.popup.querySelector('.contact__content')

  /**
   * The close button for the popup
   *
   * @type {HTMLAnchorElement}
   */
  close = document.getElementById('contact-close')

  /**
   * Start your engines!
   */
  constructor () {
    if (!this.link) {
      return
    }

    this.registerListeners()
  }

  /**
   * Register listeners for interactions with the form
   */
  registerListeners () {
    this.link.addEventListener('click', this.toggleContactForm)
    this.close.addEventListener('click', this.toggleContactForm)
    this.form.addEventListener('submit', this.handleSubmit)
  }

  /**
   * Toggles the contact form open/closed
   *
   * @param {ClickEvent} e
   */
  @bind
  toggleContactForm (e) {
    this.popup.classList.toggle('contact--open')
    document.body.classList.toggle('contact-open')
  }

  /**
   * Handle form submissions
   *
   * @param {SubmitEvent} e
   */
  @bind
  handleSubmit (e) {
    e.preventDefault()

    fetch(this.form.action, {
      method: 'POST',
      body: new FormData(this.form)
    }).then(response => {
      this.popup.scrollTop = 0
      this.content.classList.add('contact__content--hidden')
      setTimeout(() => {
        this.content.innerHTML = '<h1>Thanks for the message<br />I\'ll get back to you soon</h1>'
        this.content.classList.remove('contact__content--hidden')
      }, 1000)
    })
  }
}
