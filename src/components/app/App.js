import { BrowserRouter as Router, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { getCookie, setCookie } from 'react-use-cookie'
import { useDispatch } from 'react-redux'

import { setAuth, setUser } from '../../store/slices/userSlice'
import BlogService from '../../service/blogService'
import Header from '../header'
import ArticleList from '../articleList/articleList'
import ArticlePage from '../../pages/articlePage/articlePage'
import LoginPage from '../../pages/signPages/login'
import SignUpPage from '../../pages/signPages/register'
import ProfilePage from '../../pages/profilePage/profilePage'
import CreateArticle from '../../pages/articlePage/createArticle'
import UpdateArticle from '../../pages/articlePage/updateArticle'

import styles from './App.module.scss'

const App = () => {
  const dispatch = useDispatch()
  const token = getCookie('Token')
  useEffect(() => {
    if (token) {
      BlogService.getCurrentUser(token)
        .then((data) => {
          const { email, username, image = null } = data.user
          dispatch(setAuth(true))
          dispatch(setUser({ username, email, image }))
        })
        .catch(() => setCookie('Token', ''))
    }
  }, [token, dispatch])

  return (
    <Router>
      <div className={styles.app}>
        <Header />
        <Route path="/" component={ArticleList} exact />
        <Route path="/articles" component={ArticleList} exact />
        <Route
          path="/articles/:slug"
          render={({ match }) => {
            const { slug } = match.params
            return <ArticlePage slug={slug} />
          }}
          exact
        />
        <Route path="/sign-in" component={LoginPage} />
        <Route path="/sign-up" component={SignUpPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/new-article" component={CreateArticle} />
        <Route
          path="/articles/:slug/edit"
          render={({ match }) => {
            const { slug } = match.params
            return <UpdateArticle slug={slug} />
          }}
          exact
        />
      </div>
    </Router>
  )
}

export default App
