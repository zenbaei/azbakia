import {NavigationScreens} from 'constants/navigation-screens';
import React from 'react';
import {User} from 'user/user';
import {getUser} from 'user/user-service';
import {Login, isEmpty, NavigationProps} from 'zenbaei-js-lib';

export default function LoginScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'loginScreen'>) {
  const login = async (id: string, password: string) => {
    if (!validate(id, password)) {
      return;
    }
    const user: User | undefined = await getUser(id, password);

    if (!user) {
      return;
    }
    navigation.navigate('homeScreen', user);
  };

  const validate = (id: string, password: string): boolean => {
    if (isEmpty(id) || isEmpty(password)) {
      return false;
    }
    return true;
  };

  return (
    <>
      <Login idPlaceholder="email" onSubmit={login} />
    </>
  );
}
