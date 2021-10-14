import {userService} from 'domain/user/user-service';
import React, {useContext, useEffect} from 'react';
import {UserContext} from 'user-context';
import {ForgetPassword} from 'zenbaei-js-lib/react';

export const ForgetPasswordScreen = () => {
  const {msgs} = useContext(UserContext);

  useEffect(() => {
    global.setAppBarTitle(msgs.forgetPassword);
  }, [msgs]);

  const findUserPass = async (email: string) => {
    const {password} = await userService.findOne('email', email);
    return password;
  };

  return <ForgetPassword appName="azbakia" retrievePassFunc={findUserPass} />;
};
