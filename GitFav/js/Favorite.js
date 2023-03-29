import { GithubUser } from "./GithubUser.js";

export class Favorite {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  delete(user) {

    const filterEntry = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filterEntry
    this.update()
    this.save()

  }

  async add(username) {

    try {

      const userExists = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase())
      if (userExists) {
        throw new Error('Usuário já favoritado!')
      }
      const user = await GithubUser.search(username)
      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }

  }

}

export class FavoriteView extends Favorite {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()

  }

  onAdd() {
    const add = document.querySelector('.search button')

    add.onclick = () => {
      const { value } = document.querySelector('.search input')
      this.add(value)
    }

  }

  update() {
    this.removeAllTr()
    this.existFavorite()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Deseja excluir este usuário?')
        if (isOk) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })
  }

  existFavorite() {
  (this.entries.length === 0 ? 
    this.root.querySelector('.nothing').classList.remove('hide') 
    :
    this.root.querySelector('.nothing').classList.add('hide'))

  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => tr.remove())
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
    <img src="https://github.com/extry.png" alt="">
    <a href="https://github.com/extry" target="_blank">
      <p>Extry</p>
      <span>extry</span>
    </a>
    </td>
    <td class="repositories">
      80
    </td>
    <td class="followers">
     23
    </td>
    <td>
      <button class="remove">
        Remover
      </button>
    </td> `

    return tr
  }
}