import { bind } from 'decko'

export default class Contact {
  link = document.getElementById('open-contact-form')

  popup = document.getElementById('contact-popup')

  close = document.getElementById('contact-close')

  constructor () {
    if (!this.link) {
      return
    }

    this.registerListeners()
  }

  registerListeners () {
    this.link.addEventListener('click', this.toggleContactForm)
    this.close.addEventListener('click', this.toggleContactForm)
  }

  @bind
  toggleContactForm (e) {
    this.popup.classList.toggle('contact__popup--open')
    document.body.classList.toggle('contact-open')
  }
}