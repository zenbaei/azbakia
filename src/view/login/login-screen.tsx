import {NavigationScreens} from 'constants/navigation-screens';
import React, {useContext, useState} from 'react';
import {User} from 'domain/user/user';
import {userService} from 'domain/user/user-service';
import {Login, NavigationProps} from 'zenbaei-js-lib/react';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native';
import {configService} from 'domain/config/config-service';

export default function LoginScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'loginScreen'>) {
  const {setCart, setFavs, msgs, theme, styles, setConfigs} =
    useContext(UserContext);
  const [showLoading, setShowLoading] = useState(false);

  useFocusEffect(() => {
    global.setAppBarTitle(msgs.login);
    global.setDisplayCartBtn('none');
  });

  const login = async (
    email: string,
    password: string,
    setErrorMsg: (msg: string) => void,
  ) => {
    setShowLoading(true);
    const user: User | undefined = await userService.findByEmailAndPass(
      email,
      password,
    );
    setShowLoading(false);

    if (!user) {
      setErrorMsg(msgs.wrongUsernameOrPassword);
      return;
    }

    global.user = {
      _id: user._id as string,
      email: user.email,
      country: user.country,
    };
    setCart(user.cart ? user.cart : []);
    setFavs(user.favs ? user.favs : []);
    configService.findAll().then((cfgs) => setConfigs(cfgs));

    navigation.navigate('drawerNavigator', {});
  };

  return (
    <>
      <Login
        verticalAlign="center"
        onPress={login}
        onPressForgetPass={() => {
          navigation.navigate('forgetPasswordScreen', {});
        }}
        onPressRegister={() => {
          navigation.navigate('registerScreen', {});
        }}
      />
      <ActivityIndicator
        style={styles.loginLoading}
        animating={showLoading}
        color={theme.secondary}
      />
    </>
  );
}
