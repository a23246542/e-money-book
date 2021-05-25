import { useContext } from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../../contexts/AuthContext';
import { Redirect, withRouter } from 'react-router-dom';
// import fbLogo from '@/assets/fb-logo.png';
import fbLogo from '../../assets/images/facebook_logo.png';
import Logo from '../../assets/logo.svg';
import style from './style.module.scss';
import styleContainer from '../style.module.scss';

const LoginPageComponent = () => {
  const { status, handleFBLogin } = useContext(AuthContext);

  if (status === 'connected') {
    return <Redirect to="/" />;
  }

  return (
    <div className={styleContainer['app-wrapper']}>
      <div className={style['login-container']}>
        <div className={style['login-content']}>
          <form>
            <div className={style['logo-wrapper']}>
              <img src={Logo} alt="" style={{ width: '50px' }} />
              <img src={fbLogo} alt="" style={{ width: '62px' }} />
            </div>
            <button
              className={`${style['fb-button']} ${'btn-reset'}`}
              onClick={handleFBLogin}
            >
              {' '}
              登入 Facebook 帳號{' '}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

LoginPageComponent.propTypes = {};

export const LoginPage = withRouter(LoginPageComponent);
