/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable dot-notation */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link, withRouter } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import classnames from 'classnames'
import { setCookie } from 'react-use-cookie'
import { useDispatch } from 'react-redux'
import { Alert } from 'antd'

import { setAuth, setUser } from '../../store/slices/userSlice'
import BlogService from '../../service/blogService'

import styles from './signPages.module.scss'

const SignUpPage = ({ history }) => {
  const [isRegisterError, setRegisterError] = useState(false)
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  })

  const dispatch = useDispatch()

  const onSubmit = ({ username, email, password }) => {
    const userData = {
      username,
      email,
      password,
    }
    BlogService.registerUser(userData)
      .then((data) => {
        if (data.user) {
          setCookie('Token', data.user.token, { secure: true })
          dispatch(setAuth(true))
          dispatch(setUser({ username: data.user.username, email: data.user.email, image: null }))
          history.push('/')
        }
      })
      .catch(() => {
        setRegisterError(true)
        setTimeout(() => setRegisterError(false), 5000)
      })
  }
  const errorAlert = <Alert message="This username or email already registered" type="error" />
  const registerForm = (
    <div className={styles.sign}>
      <h2 className={styles['sign__caption']}>Create new account</h2>
      {isRegisterError && errorAlert}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={styles['sign__label']}>
          Username
          <br />
          <input
            type="text"
            placeholder="Username"
            autoComplete="on"
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
        </label>
        <label className={styles['sign__label']}>
          Repeat Password
          <br />
          <input
            type="password"
            placeholder="Password"
            autoComplete="on"
            className={classnames(styles['sign__input'], { [styles['sign__input-error']]: errors.repeatPassword })}
            {...register('repeatPassword', {
              required: 'Password is requires',
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters.',
              },
              maxLength: {
                value: 40,
                message: 'Your Email needs to be no more than 40 characters.',
              },
              validate: (value) => value === watch('password') || 'The passwords do not match',
            })}
          />
          <div>
            {errors?.repeatPassword && <p className={styles['sign__text-error']}>{errors?.repeatPassword?.message}</p>}
          </div>
        </label>
        <div className={styles['sign__container']}>
          <input
            {...register('agreement', { required: 'Agreement is required' })}
            className={styles['sign__checkbox']}
            type="checkbox"
          />{' '}
          I Agree to the processing of my personal information
        </div>
        <div>{errors?.agreement && <p className={styles['sign__text-error']}>{errors?.agreement?.message}</p>}</div>

        <input className={styles['sign__button']} autoComplete="on" type="submit" value="Create" />
        <p className={styles['sign__redirect']}>
          Already have an account? <Link to="/sign-in">Sign In</Link>.
        </p>
      </form>
    </div>
  )

  return registerForm
}

export default withRouter(SignUpPage)
