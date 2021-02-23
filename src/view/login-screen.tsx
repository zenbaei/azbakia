import {NavigationScreens} from 'constants/navigation-screens';
import React from 'react';
import {User} from 'user/user';
import {userService} from 'user/user-service';
import {Login, NavigationProps} from 'zenbaei-js-lib/react';
import {isEmpty} from 'zenbaei-js-lib/utils';

export default function LoginScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'loginScreen'>) {
  const login = async (email: string, password: string) => {
    if (!validate(email, password)) {
      return;
    }
    const user: User | undefined = await userService.findByEmailAndPass(
      email,
      password,
    );

    if (!user) {
      return;
    }
    global.user = {_id: user._id as string, email: email};
    navigation.navigate('drawerNavigator', {
      fav: user.fav ? user.fav : [],
      cart: user.cart ? user.cart : [],
    });
  };

  const validate = (id: string, password: string): boolean => {
    if (isEmpty(id) || isEmpty(password)) {
      return false;
    }
    return true;
  };

  return (
    <>
      <Login
        idPlaceholder="email"
        onPress={(id, password) => login(id, password)}
      />
    </>
  );
}
