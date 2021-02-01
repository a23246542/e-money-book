import { createContext } from 'react';

const AuthContext = createContext({
  status: 'connected',
  authResponse: null,
  handleFBLogin: null,
  handleFBLogout: null,
});

export default AuthContext;
