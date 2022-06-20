class BlogService {
  baseUrl = 'https://kata.academy:8021/api'

  pagesPerPage = 10

  async getResponce(url, value, token, method) {
    const headers = new Headers({
      'Content-Type': 'application/json;charset=utf-8',
    })

    if (token) headers.append('Authorization', `Bearer ${token}`)

    const sendData = value
      ? {
          method: 'post',
          headers,
          body: JSON.stringify(value),
        }
      : {
          method: 'get',
          headers,
        }

    if (method) sendData.method = method
    try {
      const responce = await fetch(`${this.baseUrl}/${url}`, sendData)

      if (!responce.ok) {
        throw new Error(responce.status)
      }

      const res = await responce?.json()

      return res
    } catch (err) {
      throw new Error(err)
    }
  }

  async getArticles(offset) {
    const res = await this.getResponce(`articles?limit=${this.pagesPerPage}&offset=${offset}`)
    return res
  }

  async getArticlesFeed(token) {
    const res = await this.getResponce('articles/feed', null, token)
    return res
  }

  async getArticle(slug) {
    const res = await this.getResponce(`articles/${slug}`)
    return res
  }

  async registerUser(data) {
    const res = await this.getResponce('users', { user: data }, undefined, 'post')
    return res
  }

  async loginUser(data) {
    const res = await this.getResponce('users/login', { user: data }, undefined, 'post')
    return res
  }

  async getCurrentUser(token) {
    const res = await this.getResponce('user', null, token)
    return res
  }

  async updateUserData(data, token) {
    const res = await this.getResponce('user', { user: data }, token, 'put')
    return res
  }

  async createArticle(data, token) {
    const res = await this.getResponce(
      'articles',
      {
        article: data,
      },
      token,
      'post'
    )
    return res
  }

  async updateArticle(data, slug, token) {
    const res = await this.getResponce(`articles/${slug}`, { article: data }, token, 'put')
    return res
  }

  async deleteArticle(slug, token) {
    const res = this.getResponce(`articles/${slug}`, null, token, 'delete')
    return res
  }

  async addFavorite(slug, token) {
    const res = await this.getResponce(`articles/${slug}/favorite`, null, token, 'post')
    return res
  }

  async removeFavorite(slug, token) {
    const res = await this.getResponce(`articles/${slug}/favorite`, null, token, 'delete')
    return res
  }
}

export default new BlogService()
