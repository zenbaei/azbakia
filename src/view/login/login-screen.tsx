import {NavigationScreens} from 'constants/navigation-screens';
import React, {useContext, useState} from 'react';
import {userService} from 'domain/user/user-service';
import {Login, NavigationProps} from 'zenbaei-js-lib/react';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/native';
import {ActivityIndicator, Alert} from 'react-native';
import {configService} from 'domain/config/config-service';
import {countryService} from 'domain/country/country-service';

export default function LoginScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'loginScreen'>) {
  const {setCart, setFavs, setCurrency, msgs, theme, styles, setConfigs} =
    useContext(UserContext);
  const [showLoading, setShowLoading] = useState(false);

  useFocusEffect(() => {
    global.setAppBarTitle(msgs.login);
    global.setDisplayCartBtn(undefined);
  });

  const login = async (
    email: string,
    password: string,
    setErrorMsg: (msg: string) => void,
  ) => {
    setShowLoading(true);
    userService
      .logins(email, password)
      .then((user) => {
        setShowLoading(false);
        if (!user.activated) {
          Alert.alert(msgs.activateAcc);
          return;
        }
        global.user = {
          _id: user._id,
          email: user.email,
          country: user.country,
        };
        global.token = user.token;
        setCart(user.cart ? user.cart : {date: new Date(), products: []});
        setFavs(user.favs ? user.favs : []);
        configService.findAll().then((cfgs) => setConfigs(cfgs));
        countryService
          .findOne('country', user.country)
          .then((c) => setCurrency(c.currency));

        navigation.navigate('drawerNavigator', {});
      })
      .catch((_reason) => {
        setShowLoading(false);
        setErrorMsg(msgs.wrongUsernameOrPassword);
      });
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
