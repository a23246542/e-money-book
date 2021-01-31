import { useState, useEffect } from 'react';

const useFackbookLogin = () => {
  const [fbResponse, setFbResponse] = useState();

  useEffect(() => {
    // 載入 Facebook SDK 並完成 init 的動作
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '420878639160824',
        cookie: true,
        xfbml: true,
        version: 'v9.0',
      });
      // 取得使用者登入狀態
      window.FB.getLoginStatus(function (response) {
        setFbResponse(response);
        console.log(response);
      });

      window.FB.AppEvents.logPageView();
    };
    // 載入Facebook SDK
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const handleFBLogin = (e) => {
    e.preventDefault();
    window.FB.login(function (response) {
      console.log(response);
    });
  };

  const handleFBLogout = (e) => {
    e.preventDefault();
    window.FB.logout(function (response) {
      console.log(response);
    });
  };

  return [fbResponse, handleFBLogin, handleFBLogout];
};

export default useFackbookLogin;
