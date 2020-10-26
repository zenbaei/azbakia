import React from 'react';
import Login from 'zenbaei_js_lib/src/react/components/login';

export default function LoginScreen() {
  const loginClbk = () => {};

  return <Login id_placeholder="Email" on_submit_callback={loginClbk} />;
}
