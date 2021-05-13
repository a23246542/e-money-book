import { createContext, useMemo } from 'react';
import { useRouteMatch, Redirect } from 'react-router-dom';
import useFacebookLogin from '@/hooks/useFacebookLogin';

const AuthContext = createContext({
  status: 'connected',
  authResponse: null,
  handleFBLogin: null,
  handleFBLogout: null,
});

export const AuthProvider = ({ children }) => {
  const [fbResponse, handleFBLogin, handleFBLogout] = useFacebookLogin({
    appId: process.env.REACT_APP_FB_APP_ID,
    cookie: true,
    xfbml: true,
    version: process.env.REACT_APP_FB_APP_VERSION,
  });
  const isAtLoginPage = useRouteMatch('/login');
  const AuthContextValue = useMemo(() => {
    if (fbResponse) {
      return {
        status: fbResponse.status,
        authResponse: fbResponse.authResponse,
        handleFBLogin,
        handleFBLogout,
      };
    }
  }, [fbResponse, handleFBLogin, handleFBLogout]);
  // 等待回傳
  if (!fbResponse) {
    return <></>;
  }
  // 處理使用者輸入其他網址
  if (fbResponse.status !== 'connected' && !isAtLoginPage) {
    return <Redirect to="/login" />;
  }

  return (
    <AuthContext.Provider value={AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
