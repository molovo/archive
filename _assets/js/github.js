/**
 * Provides methods for retrieving repository data from Github
 *
 * @type {Github}
 */
export default class Github {
  /**
   * The project elements present on the page
   *
   * @type {NodeList}
   */
  projects = document.querySelectorAll('[data-repo]')

  /**
   * Start your engines!
   *
   * @return {Github}
   */
  constructor () {
    if (this.projects.length > 0) {
      this.loadStarCounts()
    }
  }

  /**
   * Load star counts for projects
   */
  loadStarCounts () {
    // Loop through each of the projects
    this.projects.forEach(project => {
      // Get the repository slug from the element's dataset
      const repo = project.dataset.repo

      // Retrieve the repository data from the API or cache
      this.getRepoData(repo)
        // Handle the response
        .then(response => {
          // Fill the template with the repository info
          project.dataset.language = response.language
          project.querySelector('[data-name]').innerText = response.name
          project.querySelector('[data-description]')
            .innerText = response.description
          project.querySelector('[data-language]').innerText = response.language
          project.querySelector('[data-owner]').innerText = response.owner.login
          project.querySelector('[data-forks]').innerText = response.forks
          project.querySelector('[data-stars]')
            .innerText = response.stargazers_count
        })

        // Catch errors
        .catch(err => { // eslint-disable-line handle-callback-err
          // We catch error responses to prevent dirtying the console,
          // but don't do anything with the error since the original
          // data can remain on the page
        })
    })
  }

  /**
   * Get repository data from Github's API, and then cache it
   * for 30 minutes in localStorage
   *
   * @param  {string} repo The repository slug
   *
   * @return {Promise}
   */
  getRepoData (repo) {
    /**
     * Create a promise which returns repository information
     *
     * @param  {function} resolve
     * @param  {function} reject
     *
     * @return {Promise}
     */
    return new Promise((resolve, reject) => {
      // Retrieve the cached data and last update time from localStorage
      const time = localStorage.getItem('repo-data-last-update-time')
      const cached = localStorage.getItem(`repo-data.${repo}`)

      // If cached data exists and is newer than 5 minutes, return it
      if (cached && (time && (new Date()).getTime() < (time + 1800))) {
        return resolve(JSON.parse(cached))
      }

      // Fetch the repo data from Github's API
      fetch(`https://api.github.com/repos/${repo}`)
        // Parse the JSON response
        .then(response => {
          response.json()
        })

        // Deal with the repository data
        .then(response => {
          // If there is no repository name, an error likely occurred
          if (!response.name) {
            return reject(response)
          }

          // Cache the response, and record the current time
          localStorage.setItem(`repo-data.${repo}`, JSON.stringify(response))
          localStorage.setItem(
            'repo-data-last-update-time',
            (new Date()).getTime()
          )

          // Return the response
          resolve(response)
        })

        // Handle errors
        .catch(reject)
    })
  }
}
