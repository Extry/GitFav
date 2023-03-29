export class GithubUser {

  static search(login) {

    const api = `https://api.github.com/users/${login}`

    return fetch(api)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers
      }))
  }
}

