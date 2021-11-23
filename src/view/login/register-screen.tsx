import {useFocusEffect} from '@react-navigation/core';
import {NavigationScreens} from 'constants/navigation-screens';
import {userService} from 'domain/user/user-service';
import React, {useCallback, useContext} from 'react';
import {Alert} from 'react-native';
import {UserContext} from 'user-context';
import {sendActivationEmail} from 'view/login/login-actions';
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
    const user = await userService.registers(email, password);
    if (!user || !user._id) {
      setErrorMsg(msgs.emailExists);
      return;
    }
    !(await sendActivationEmail(
      user,
      msgs.activationEmailSubject,
      msgs.activationEmailBody,
    ))
      ? userService.updateById(user._id, {$set: {activated: true}})
      : alert();
  };
  return <Register onPress={onPress} />;
};
