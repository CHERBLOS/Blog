/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
/* eslint-disable dot-notation */
import React, { useState } from 'react'
import format from 'date-fns/format'
import { Link, withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { getCookie } from 'react-use-cookie'
import { Popconfirm } from 'antd'

import BlogService from '../../service/blogService'

import styles from './articleItem.module.scss'

const ArticleItem = ({ data: articleData, slug = null, history }) => {
  const [data, setData] = useState(articleData)
  const { user } = useSelector((state) => state.user)
  const tags = data.tagList.map(
    (item, index) =>
      item !== '' && (
        <span key={`${data.slug}_item_${index}`} className={styles['articleItem__tags-item']}>
          {item}
        </span>
      )
  )

  const confirm = async () => {
    const token = getCookie('Token')
    BlogService.deleteArticle(data.slug, token)
    history.push('/')
  }

  const onLikeClick = () => {
    const token = getCookie('Token')
    if (!data.favorited) {
      BlogService.addFavorite(data.slug, token).then((res) => setData(res.article))
    } else {
      BlogService.removeFavorite(data.slug, token).then((res) => setData(res.article))
    }
  }

  const editButtons = data.author.username === user?.username && slug && (
    <div className={styles['articleItem__button-container']}>
      <Popconfirm title="Are you sure to delete this article?" onConfirm={confirm} okText="Yes" cancelText="No">
        <button
          type="button"
          className={classNames(styles['articleItem__button'], styles['articleItem__button-delete'])}
        >
          Delete
        </button>
      </Popconfirm>

      <Link to={`/articles/${slug}/edit`} className={styles['articleItem__button']}>
        Edit
      </Link>
    </div>
  )

  return (
    <div className={styles.articleItem}>
      <div className={styles['articleItem__title']}>
        <Link to={`/articles/${data.slug}`} className={styles['articleItem__title-capture']}>
          {data.title}
        </Link>
        <span className={styles['articleItem__likes']}>
          <button
            type="button"
            onClick={onLikeClick}
            className={classNames(styles['articleItem__like-icon'], {
              [styles['articleItem__like-icon--active']]: data.favorited,
            })}
          />
          <span className={styles['articleItem__likes-text']}>{data.favoritesCount}</span>
        </span>
      </div>
      <div className={styles['articleItem__tags-list']}>{tags}</div>
      <p className={styles['articleItem__description']}>{data.description}</p>
      {slug && <p className={styles['articleItem__article-text']}>{data.body}</p>}
      <div className={styles['articleItem__profile']}>
        <div className={styles['articleItem__profile-info']}>
          <span className={styles['articleItem__profile-name']}>{data.author.username}</span>
          <span>{format(new Date(data.createdAt), 'MMMM dd, yyyy')}</span>
        </div>
        <img className={styles['articleItem__profile-avatar']} src={data.author.image} alt="avatar" />
      </div>
      {editButtons}
    </div>
  )
}

export default withRouter(ArticleItem)
