/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-useless-escape */
/* eslint-disable dot-notation */
/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form'
import { withRouter } from 'react-router-dom'
import classnames from 'classnames'
import { setCookie, getCookie } from 'react-use-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { Alert } from 'antd'

import BlogService from '../../service/blogService'
import { setUser } from '../../store/slices/userSlice'
import styles from '../signPages/signPages.module.scss'

const ProfilePage = ({ history }) => {
  const [isError, setError] = useState(false)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  })
  const onSubmit = ({ email, username, image }) => {
    const userData = {
      email,
      token: getCookie('Token'),
      username,
      bio: '',
      image,
    }
    BlogService.updateUserData(userData, userData.token)
      .then((data) => {
        if (data.user) {
          setCookie('Token', data.user.token, { secure: true })
          dispatch(
            setUser({
              username: data.user.username,
              email: data.user.email,
              image: data.user.image ? data.user.image : null,
            })
          )
        }
        reset()
      })
      .catch(() => {
        setError(true)
        setTimeout(() => setError(false), 5000)
      })
  }
  const errorAlert = <Alert message="This username or password is busy." type="error" />
  const form = user?.username && (
    <div className={styles.sign}>
      <h2 className={styles['sign__caption']}>Edit Profile</h2>
      {isError && errorAlert}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={styles['sign__label']}>
          Username
          <br />
          <input
            type="text"
            placeholder="Username"
            autoComplete="on"
            defaultValue={user.username}
            className={classnames(styles['sign__input'], { [styles['sign__input-error']]: errors.username })}
            {...register('username', {
              required: 'Username is requires',
              minLength: {
                value: 3,
                message: 'Your username needs to be at least 3 characters.',
              },
              maxLength: {
                value: 20,
                message: 'Your username needs to be no more than 20 characters.',
              },
            })}
          />
          <div>{errors?.username && <p className={styles['sign__text-error']}>{errors?.username?.message}</p>}</div>
        </label>
        <label className={styles['sign__label']}>
          Email address
          <br />
          <input
            type="email"
            placeholder="Email adress"
            autoComplete="on"
            defaultValue={user.email}
            className={classnames(styles['sign__input'], { [styles['sign__input-error']]: errors.email })}
            {...register('email', {
              required: 'Email is requires',
              minLength: {
                value: 3,
                message: 'Your Email needs to be at least 3 characters.',
              },
              maxLength: {
                value: 20,
                message: 'Your Email needs to be no more than 20 characters.',
              },
            })}
          />
          <div>{errors?.email && <p className={styles['sign__text-error']}>{errors?.email?.message}</p>}</div>
        </label>
        <label className={styles['sign__label']}>
          Password
          <br />
          <input
            type="password"
            placeholder="Password"
            autoComplete="on"
            className={classnames(styles['sign__input'], { [styles['sign__input-error']]: errors.password })}
            {...register('password', {
              required: 'Password is requires',
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters.',
              },
              maxLength: {
                value: 40,
                message: 'Your Email needs to be no more than 40 characters.',
              },
            })}
          />
          <div>{errors?.password && <p className={styles['sign__text-error']}>{errors?.password?.message}</p>}</div>
        </label>
        <label className={styles['sign__label']}>
          Image
          <br />
          <input
            type="text"
            placeholder="Avatar image"
            autoComplete="on"
            className={classnames(styles['sign__input'], { [styles['sign__input-error']]: errors.image })}
            {...register('image', {
              pattern: {
                value:
                  /^(http:\/\/www.|https:\/\/www.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i,
                message: 'Please enter valid url',
              },
            })}
          />
          <div>{errors?.image && <p className={styles['sign__text-error']}>{errors?.image?.message}</p>}</div>
        </label>
        <input className={styles['sign__button']} autoComplete="on" type="submit" value="Save" />
      </form>
    </div>
  )
  const content = user?.username ? form : history.push('/')
  return content
}

export default withRouter(ProfilePage)
