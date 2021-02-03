// import useFacebookLogin from "../hooks/useFacebookLogin"

const useFacebookLogin = jest.fn().mockReturnValue([
  {
    status: 'connected',
  },
  jest.fn(),
  jest.fn(),
]);

export default useFacebookLogin;
