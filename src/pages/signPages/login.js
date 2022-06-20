/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable dot-notation */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link, withRouter } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import classnames from 'classnames'
import { setCookie } from 'react-use-cookie'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { Alert } from 'antd'

import { setAuth, setUser } from '../../store/slices/userSlice'
import BlogService from '../../service/blogService'

import styles from './signPages.module.scss'

const LoginPage = ({ history }) => {
  const [isLoginError, setLoginError] = useState(false)
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  })

  const onSubmit = ({ email, password }) => {
    const userData = {
      email,
      password,
    }
    BlogService.loginUser(userData)
      .then((data) => {
        if (data.user) {
          setCookie('Token', data.user.token, { secure: true })
          dispatch(setAuth(true))
          dispatch(
            setUser({
              username: data.user.username,
              email: data.user.email,
              image: data.user.image ? data.user.image : null,
            })
          )
          history.push('/')
        }
        reset()
      })
      .catch(() => {
        setLoginError(true)
        setTimeout(() => setLoginError(false), 5000)
      })
  }
  const errorAlert = <Alert message="Invalid username or email" type="error" />
  return (
    <div className={styles.sign}>
      <h2 className={styles['sign__caption']}>Sign In</h2>
      {isLoginError && errorAlert}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={styles['sign__label']}>
          Email address
          <br />
          <input
            type="email"
            placeholder="Email adress"
            autoComplete="on"
            className={classnames(styles['sign__input'], { [styles['sign__input-error']]: errors.emailAdress })}
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
          <div>
            {errors?.emailAdress && <p className={styles['sign__text-error']}>{errors?.emailAdress?.message}</p>}
          </div>
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
        <input className={styles['sign__button']} autoComplete="on" type="submit" value="Login" />
        <p className={styles['sign__redirect']}>
          Don&apos;t have an account? <Link to="/sign-up">Sign Up</Link>.
        </p>
      </form>
    </div>
  )
}

export default withRouter(LoginPage)
