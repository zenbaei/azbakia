import {NavigationScreens} from 'constants/navigation-screens';
import React from 'react';
import {User} from 'user/user';
import {UserService} from 'user/user-service';
import {Login, NavigationProps} from 'zenbaei-js-lib/react';
import {isEmpty} from 'zenbaei-js-lib/utils';

export default function LoginScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'loginScreen'>) {
  const login = async (email: string, password: string) => {
    if (!validate(email, password)) {
      return;
    }
    const users: User[] | undefined = await userService.getByQuery({
      email: email,
      password: password,
    });

    if (!users || users.length !== 1) {
      return;
    }
    navigation.navigate('drawerNavigation', users[0]);
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

const userService: UserService = new UserService();
