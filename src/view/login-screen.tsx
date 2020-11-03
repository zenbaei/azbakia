import Colors from 'constants/app-colors';
import React, {useState} from 'react';
import {Login, isEmpty} from 'zenbaei-js-lib';

export default function LoginScreen() {
  const [bgColor, setBgColor] = useState(Colors.background);

  const login = (id: string, password: string) => {
    validate(id, password);
  };

  const validate = (id: string, password: string): boolean => {
    if (isEmpty(id) || isEmpty(password) || isValid()) {
      setBgColor(Colors.error);
      return false;
    }
    return true;
  };

  return (
    <Login idPlaceholder="email" inputTextBgColor={bgColor} onSubmit={login} />
  );
}
