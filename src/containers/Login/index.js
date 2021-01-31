import { useContext } from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss';
import AuthContext from '../../contexts/AuthContext';

const Login = () => {
  const {
    fbResponse,
    setFbResponse,
    handleFBLogin,
    handleFBLogout,
  } = useContext(AuthContext);
  return (
    <div className={style['form-container']}>
      <div className={style['form-content']}>
        <form
          className="simple_form new_user"
          id="new_user"
          noValidate="novalidate"
          action="/sessions"
          acceptCharset="UTF-8"
          method="post"
        >
          <input name="utf8" type="hidden" value="✓" />
          <input
            type="hidden"
            name="authenticity_token"
            value="WbQiZaOBi36i7DkmOIzmEPrL/4vG2UBRd9CaG6KtBJ2M+EG6LXV15dyVHi2wVuRbt4ZzLc3xo8UhtVi2uHfckg=="
          />
          <div className="form-wrapper">
            <div className="form-group email optional user_email">
              <label
                className="control-label email optional"
                htmlFor="user_email"
              >
                Email
              </label>
              <input
                className="form-control string email optional"
                autoFocus="autofocus"
                type="email"
                name="user[email]"
                id="user_email"
              />
            </div>
          </div>
          <div className="form-wrapper">
            <div className="form-group password optional user_password">
              <label
                className="control-label password optional"
                htmlFor="user_password"
              >
                密碼
              </label>
              <input
                className="form-control password optional"
                type="password"
                name="user[password]"
                id="user_password"
              />
              <p className="help-block">
                Passwords must be at least 6 characters in length.
              </p>
            </div>
          </div>
          <input
            type="submit"
            name="commit"
            value="登入"
            className="btn btn-block btn-primary"
          />
          <button
            className={`${style['fb-button']} ${'btn-reset'}`}
            onClick={(e) => {
              handleFBLogin(e);
            }}
          >
            {' '}
            使用 Facebook 登入{' '}
          </button>
          <button
            className={`${style['fb-button']} ${'btn-reset'}`}
            onClick={(e) => {
              handleFBLogout(e);
            }}
          >
            {' '}
            使用 Facebook 登出{' '}
          </button>
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {};

export default Login;
