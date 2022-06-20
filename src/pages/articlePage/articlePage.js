/* eslint-disable import/no-named-as-default */
/* eslint-disable dot-notation */
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Spin } from 'antd'
import { getCookie } from 'react-use-cookie'

import { setArticle } from '../../store/slices/articleSlice'
import { setLoading } from '../../store/slices/uiSlice'
import ArticleItem from '../../components/articleItem/articleItem'
import BlogService from '../../service/blogService'

import styles from './articlePage.module.scss'

const ArticlePage = ({ slug }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const token = getCookie('Token') ? getCookie('Token') : null
    dispatch(setLoading(true))
    BlogService.getArticle(slug, token).then((data) => dispatch(setArticle(data)))
    dispatch(setLoading(false))
  }, [dispatch, slug])
  const { isLoading } = useDispatch((state) => state.ui)
  const { article } = useSelector((state) => state.article)

  const content =
    article?.slug === slug && !isLoading ? (
      <div className={styles.articlePage}>
        <ArticleItem data={article} slug={slug} />
      </div>
    ) : (
      <Spin className={styles['articlePage__spin']} size="large" />
    )

  return content
}

export default ArticlePage
