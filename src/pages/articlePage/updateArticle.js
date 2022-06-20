/* eslint-disable dot-notation */
import { getCookie } from 'react-use-cookie'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { Spin } from 'antd'

import { setLoading } from '../../store/slices/uiSlice'
import { setArticle } from '../../store/slices/articleSlice'
import ArticleForm from '../../components/articleForm/articleForm'
import BlogService from '../../service/blogService'

import styles from './articlePage.module.scss'

const UpdateArticle = ({ slug, history }) => {
  const dispatch = useDispatch()
  const { article } = useSelector((state) => state.article)
  const { isLoading } = useSelector((state) => state.ui)
  const [isError, setError] = useState(false)
  const onSubmit = ({ title, description, body, tags }) => {
    const dataArticle = {
      title,
      description,
      body,
      tagList: tags,
    }
    const token = getCookie('Token')
    dispatch(setLoading(true))
    BlogService.updateArticle(dataArticle, slug, token)
      .then((data) => {
        dispatch(setLoading(false))
        dispatch(setArticle(data.article))
      })
      .then(() => history.push(`/articles/${slug}`))
      .catch(() => {
        setError(true)
        setTimeout(() => setError(false), 5000)
      })
  }

  return isLoading ? (
    <Spin className={styles['articlePage__spin']} size="large" />
  ) : (
    <ArticleForm title="Update article" onSubmit={onSubmit} data={article} isError={isError} />
  )
}

export default withRouter(UpdateArticle)
