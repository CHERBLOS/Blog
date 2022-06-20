/* eslint-disable import/no-named-as-default */
/* eslint-disable dot-notation */
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Pagination, Spin, Alert } from 'antd'
import { getCookie } from 'react-use-cookie'

import { setArticles, setArticlesCount } from '../../store/slices/articleSlice'
import { setLoading } from '../../store/slices/uiSlice'
import ArticleItem from '../articleItem/articleItem'
import BlogService from '../../service/blogService'

import styles from './articleList.module.scss'

const ArticleList = () => {
  const [pageNumer, togglePageNumber] = useState(1)
  const [isError, setError] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    const token = getCookie('Token') ? getCookie('Token') : null
    BlogService.getArticles(pageNumer * 10 - 10, token)
      .then((data) => {
        dispatch(setArticles(data))
        dispatch(setArticlesCount(data))
        dispatch(setLoading(false))
      })
      .catch(() => {
        dispatch(setLoading(false))
        setError(true)
        setTimeout(() => setError(false), 5000)
      })
  }, [pageNumer, dispatch])

  const onChange = (page) => {
    togglePageNumber(page)
  }
  const errorAlert = <Alert message="Server error! Please try later" type="error" />
  const { articles, articlesCount } = useSelector((state) => state.article)
  const { isLoading } = useSelector((state) => state.ui)
  const content =
    !isLoading && articles.length ? (
      <>
        <ul className={styles.list}>
          {isError && errorAlert}
          {articles.map((item) => (
            <ArticleItem key={item.slug} data={item} />
          ))}
        </ul>
        <Pagination
          className={styles['list__pagination']}
          onChange={onChange}
          current={pageNumer}
          size="small"
          total={articlesCount}
        />
      </>
    ) : (
      <Spin className={styles['list__spin']} size="large" />
    )
  return content
}

export default ArticleList
