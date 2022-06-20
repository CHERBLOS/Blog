/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-empty-function */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

// export const getArticles = createAsyncThunk('articles/getArticles', async function () {
//   try {
//     const response = await fetch('https://kata.academy:8021/api/articles?limit=10')

//     if (!response.ok) throw new Error('Could not fetch')

//     const data = await response.json()
//     return data
//   } catch (error) {
//     throw new Error(error)
//   }
// })

const articleSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    article: {},
    articlesCount: 0,
  },
  reducers: {
    setArticles(state, action) {
      state.articles = action.payload.articles
    },
    setArticle(state, action) {
      state.article = action.payload.article
    },
    setArticlesCount(state, action) {
      state.articlesCount = action.payload.articlesCount
    },
  },
})

export const { setArticles, setArticle, setArticlesCount } = articleSlice.actions
export default articleSlice.reducer
