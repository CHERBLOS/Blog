/* eslint-disable dot-notation */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-undef */
import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'
import classnames from 'classnames'
import { Alert } from 'antd'

import styles from './articleForm.module.scss'

const ArticleForm = ({ title, onSubmit, data = null, isError = false }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    mode: 'onBlur',
  })

  const { fields, append, remove } = useFieldArray({ name: 'tags', control })

  const addTag = (value = '') => {
    append(value)
  }
  const deleteTag = (index) => {
    remove(index)
  }

  useEffect(() => {
    if (data?.tagList) data.tagList.map((item) => append(item))
  }, [data?.tagList, append])
  const tagList = fields.map((field, index) => (
    <div className={styles['articleForm__tag-container']} key={field.id}>
      <label className={styles['articleForm__tag']}>
        <input
          type="text"
          placeholder="Tag"
          autoComplete="on"
          className={classnames(styles['articleForm__input'], styles['articleForm__input-tag'], {
            [styles['articleForm__input-error']]: errors?.tags?.[`${index}`],
          })}
          {...register(`tags.${index}`, {
            required: 'Tag is requires',
          })}
        />
        <div>
          {errors?.tags && <p className={styles['articleForm__text-error']}>{errors?.tags?.[`${index}`]?.message}</p>}
        </div>
      </label>
      <button
        type="button"
        onClick={() => {
          deleteTag(index)
        }}
        className={classnames(styles['articleForm__button'], styles['articleForm__button-delete'])}
      >
        Delete
      </button>
    </div>
  ))
  const errorAlert = <Alert message="Server Error! Please try later" type="error" />
  return (
    <div className={styles.articleForm}>
      <h2 className={styles['articleForm__caption']}>{title}</h2>
      {isError && errorAlert}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={styles['articleForm__label']}>
          Title
          <br />
          <input
            type="text"
            placeholder="Title"
            autoComplete="on"
            defaultValue={data?.title}
            className={classnames(styles['articleForm__input'], {
              [styles['articleForm__input-error']]: errors.title,
            })}
            {...register('title', {
              required: 'Title is requires',
              minLength: {
                value: 2,
                message: 'Your title needs to be at least 2 characters.',
              },
            })}
          />
          <div>{errors?.title && <p className={styles['articleForm__text-error']}>{errors?.title?.message}</p>}</div>
        </label>
        <label className={styles['articleForm__label']}>
          Short description
          <br />
          <input
            type="text"
            placeholder="Description"
            autoComplete="on"
            defaultValue={data?.description}
            className={classnames(styles['articleForm__input'], {
              [styles['articleForm__input-error']]: errors.description,
            })}
            {...register('description', {
              required: 'Description is requires',
              minLength: {
                value: 2,
                message: 'Your description needs to be at least 2 characters.',
              },
            })}
          />
          <div>
            {errors?.description && <p className={styles['articleForm__text-error']}>{errors?.description?.message}</p>}
          </div>
        </label>
        <label className={styles['articleForm__label']}>
          Text
          <br />
          <textarea
            type="text"
            placeholder="Text"
            autoComplete="on"
            defaultValue={data?.body}
            className={classnames(styles['articleForm__input'], styles['articleForm__textarea'], {
              [styles['articleForm__input-error']]: errors.body,
            })}
            {...register('body', {
              required: 'Text is requires',
              minLength: {
                value: 3,
                message: 'Your text needs to be at least 3 characters.',
              },
            })}
          />
          <div>{errors?.body && <p className={styles['articleForm__text-error']}>{errors?.body?.message}</p>}</div>
        </label>
        <p className={styles['articleForm__tags-caption']}>Tags</p>
        <ul className={styles['articleForm__tagList']}>
          {tagList}
          <button
            type="button"
            onClick={() => {
              addTag()
            }}
            className={classnames(styles['articleForm__button'])}
          >
            Add tag
          </button>
        </ul>

        <input
          className={classnames(styles['articleForm__button'], styles['articleForm__submit-button'])}
          autoComplete="on"
          type="submit"
          value="Send"
        />
      </form>
    </div>
  )
}

export default ArticleForm
