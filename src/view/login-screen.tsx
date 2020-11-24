import Colors from 'constants/app-colors';
import {getMessages} from 'constants/in18/messages';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useState} from 'react';
import {User} from 'user/user';
import {loginUser} from 'user/user-service';
import {Login, isEmpty, Errors, NavigationProps} from 'zenbaei-js-lib';

export default function LoginScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'loginScreen'>) {
  const [bgColor, setBgColor] = useState(Colors.background);
  const [messages, setMessages] = useState(['']);

  const login = async (id: string, password: string) => {
    if (!validate(id, password)) {
      return;
    }
    const user: User | undefined = await loginUser(id, password);
    if (!user) {
      setMessages([getMessages().invalidUser]);
      return;
    }
    navigation.navigate('homeScreen', user);
  };

  const validate = (id: string, password: string): boolean => {
    if (isEmpty(id) || isEmpty(password)) {
      setBgColor(Colors.error);
      return false;
    }
    return true;
  };

  return (
    <>
      <Login
        idPlaceholder="email"
        inputTextBgColor={bgColor}
        onSubmit={login}
      />
      <Errors messages={messages} />
    </>
  );
}
