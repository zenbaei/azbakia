import {useFocusEffect} from '@react-navigation/core';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useCallback, useContext} from 'react';
import {Alert} from 'react-native';
import {UserContext} from 'user-context';
import {unexpectedError} from 'view/common-actions';
import {
  emailShouldNotExist,
  saveUser,
  sendActivationEmail,
} from 'view/login/login-actions';
import {NavigationProps, Register} from 'zenbaei-js-lib/react';

export const RegisterScreen = ({
  navigation,
}: NavigationProps<NavigationScreens, 'registerScreen'>) => {
  const {msgs} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => global.setAppBarTitle(msgs.register), [msgs.register]),
  );

  const alert = () =>
    Alert.alert(msgs.welcome, msgs.activateAcc, [
      {text: msgs.ok, onPress: () => navigation.navigate('loginScreen', {})},
    ]);

  const onPress = async (
    email: string,
    password: string,
  ): Promise<boolean | void> => {
    const result: boolean = await emailShouldNotExist(email);
    if (!result) {
      return false;
    }
    if (
      (await saveUser(email, password)) &&
      (await sendActivationEmail(
        email,
        msgs.activationEmailSubject,
        msgs.activationEmailBody,
      ))
    ) {
      alert();
    } else {
      unexpectedError(navigation);
    }
  };
  return <Register onPress={onPress} />;
};
