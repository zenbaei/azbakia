import {getMessages} from 'constants/in18/messages';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useContext} from 'react';
import {User} from 'domain/user/user';
import {userService} from 'domain/user/user-service';
import {Login, NavigationProps} from 'zenbaei-js-lib/react';
import {isEmpty} from 'zenbaei-js-lib/utils';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/native';

export default function LoginScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'loginScreen'>) {
  const {setCart, setFavs} = useContext(UserContext);

  useFocusEffect(() => {
    global.setAppBarTitle(getMessages().login);
    global.setDisplayCartBtn('none');
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isEmpty(email) || isEmpty(password)) {
      return false;
    }
    const user: User | undefined = await userService.findByEmailAndPass(
      email,
      password,
    );

    if (!user) {
      return false;
    }
    global.user = {
      _id: user._id as string,
      email: user.email,
    };
    setCart(user.cart ? user.cart : []);
    setFavs(user.favs ? user.favs : []);
    navigation.navigate('drawerNavigator', {});
    return true;
  };

  return (
    <>
      <Login
        verticalAlignment="center"
        onPress={(id, password) => login(id, password)}
        onPressForgetPass={() => {}}
        onPressRegister={() => {}}
      />
    </>
  );
}
