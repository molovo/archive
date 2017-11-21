import { bind } from 'decko'

export default class Contact {
  link = document.getElementById('open-contact-form')

  popup = document.getElementById('contact-popup')

  close = document.getElementById('contact-close')

  formChoices = this.popup.querySelectorAll('.contact__form-choice')

  constructor () {
    console.log(this.popup)
    console.log(this.formChoices)
    if (!this.link) {
      return
    }

    this.registerListeners()
  }

  registerListeners () {
    this.link.addEventListener('click', this.toggleContactForm)
    this.close.addEventListener('click', this.toggleContactForm)

    this.formChoices.forEach(choice => {
      console.log(choice)
      choice.addEventListener('click', e => {
        console.log(choice.dataset.form)
        this.popup.dataset.form = choice.dataset.form
      })
    })
  }

  @bind
  toggleContactForm (e) {
    this.popup.classList.toggle('contact__popup--open')
    document.body.classList.toggle('contact-open')
  }
}