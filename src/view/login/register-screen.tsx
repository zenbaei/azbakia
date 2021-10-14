import {useFocusEffect} from '@react-navigation/core';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useCallback, useContext} from 'react';
import {Alert} from 'react-native';
import {UserContext} from 'user-context';
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
    useCallback(() => global.setAppBarTitle(msgs.register), [msgs]),
  );

  const alert = () =>
    Alert.alert(msgs.welcome, msgs.userCreated, [
      {text: msgs.ok, onPress: () => navigation.navigate('loginScreen', {})},
    ]);

  const onPress = async (
    email: string,
    password: string,
    setErrorMsg: (errMsg: string) => void,
  ): Promise<boolean | void> => {
    if (!(await emailShouldNotExist(email))) {
      setErrorMsg(msgs.emailExists);
      return;
    }
    if (!(await saveUser(email, password))) {
      setErrorMsg(msgs.saveError);
      return;
    }
    if (
      !(await sendActivationEmail(
        email,
        msgs.activationEmailSubject,
        msgs.activationEmailBody,
      ))
    ) {
      setErrorMsg(msgs.sendingEmailError);
      return;
    }
    alert();
  };
  return <Register onPress={onPress} />;
};
