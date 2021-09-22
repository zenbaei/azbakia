import {useFocusEffect} from '@react-navigation/core';
import {NavigationScreens} from 'constants/navigation-screens';
import {userService} from 'domain/user/user-service';
import React, {useCallback, useContext, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {UserContext} from 'user-context';
import {getDefaultAddress} from 'view/address/address-actions';
import {
  Grid,
  Row,
  Col,
  NavigationProps,
  Card,
  Text,
  Ctx,
  InputText,
  Button,
  SnackBar,
} from 'zenbaei-js-lib/react';
import {isValidNumber} from 'zenbaei-js-lib/utils';
import {Address, modificationResult} from 'zenbaei-js-lib/types';
import {isEmpty} from 'zenbaei-js-lib/utils';

import {mobileNoLength} from '../../../app.config';

export const ProfileScreen = ({
  navigation,
}: NavigationProps<NavigationScreens, 'profileScreen'>) => {
  const {msgs, styles, theme} = useContext(UserContext);
  const zenbaeiCtx = useContext(Ctx);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [additionalPhoneNo, setAdditionalPhoneNo] = useState('');
  const [address, setAddress] = useState({} as Address);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [showSnackBar, setShowSnackBar] = useState(false);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.profile);
    }, [msgs]),
  );

  useFocusEffect(
    useCallback(() => {
      userService.findOne('email', global.user.email).then((usr) => {
        setPassword(usr.password);
        setConfirmPassword(usr.password);
        setPhoneNo(usr.phoneNo);
        setAdditionalPhoneNo(usr.additionalPhoneNo);
        usr.addresses && usr.addresses.length > 0
          ? setAddress(getDefaultAddress(usr.addresses))
          : setAddress({} as Address);
      });
    }, []),
  );

  const DefaultAddress = () => {
    return (
      <>
        <View style={styles.viewRow}>
          <Text
            bold
            color={theme.secondary}
            style={inlineStyle.address}
            text={msgs.street}
          />
          <Text style={inlineStyle.inputText} text={address.street} />
        </View>

        <View style={styles.viewRow}>
          <Text
            bold
            color={theme.secondary}
            style={inlineStyle.address}
            text={msgs.building}
          />
          <Text style={inlineStyle.inputText} text={address.building} />
        </View>

        <View style={styles.viewRow}>
          <Text
            bold
            color={theme.secondary}
            style={inlineStyle.address}
            text={msgs.apartment}
          />
          <Text style={inlineStyle.inputText} text={address.apartment} />
        </View>
        <Text
          align="left"
          bold
          color={theme.secondary}
          text={`${address.district}, ${address.city}`}
        />
      </>
    );
  };

  const PhoneNo = () => {
    return (
      <>
        <View style={styles.viewRow}>
          <Text
            bold
            color={theme.secondary}
            style={inlineStyle.text}
            text={msgs.phoneNo}
          />
          <InputText
            style={inlineStyle.inputText}
            value={phoneNo}
            onChangeText={(val) => setPhoneNo(val.trim())}
          />
        </View>
        <View style={styles.viewRow}>
          <Text
            bold
            color={theme.secondary}
            style={inlineStyle.text}
            text={msgs.additionalPhoneNo}
          />
          <InputText
            style={inlineStyle.inputText}
            value={additionalPhoneNo}
            onChangeText={(val) => setAdditionalPhoneNo(val.trim())}
          />
        </View>
      </>
    );
  };

  const Password = () => {
    return (
      <>
        <View style={styles.viewRow}>
          <Text
            bold
            color={theme.secondary}
            style={inlineStyle.text}
            text={zenbaeiCtx.msgs.password}
          />
          <InputText
            style={inlineStyle.inputText}
            value={password}
            password
            onChangeText={(val) => setPassword(val.trim())}
          />
        </View>
        <View style={styles.viewRow}>
          <Text
            bold
            color={theme.secondary}
            style={inlineStyle.text}
            text={zenbaeiCtx.msgs.confirmPassword}
          />
          <InputText
            style={inlineStyle.inputText}
            value={confirmPassword}
            password
            onChangeText={(val) => setConfirmPassword(val.trim())}
          />
        </View>
      </>
    );
  };

  const savePhoneNo = () => {
    if (isEmpty(phoneNo)) {
      Alert.alert(msgs.phoneNoManadatory);
      return;
    }
    if (
      !phoneNo ||
      phoneNo.length < mobileNoLength ||
      !isValidNumber(phoneNo)
    ) {
      Alert.alert(msgs.invalidPhoneNo);
      return;
    }
    if (
      additionalPhoneNo &&
      additionalPhoneNo.length > 0 &&
      !isValidNumber(additionalPhoneNo)
    ) {
      Alert.alert(msgs.invalidAdditionalPhoneNo);
      return;
    }

    userService
      .updateById(global.user._id, {
        $set: {phoneNo: phoneNo, additionalPhoneNo: additionalPhoneNo},
      })
      .then((mr) => snackBar(mr, msgs.phoneNoSaved));
  };

  const snackBar = (mr: modificationResult, msg: string) => {
    if (mr.modified === 1) {
      setSnackBarMsg(msg);
    }
  };

  const changePassword = () => {
    if (isEmpty(password)) {
      Alert.alert(zenbaeiCtx.msgs.shortPassword);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(zenbaeiCtx.msgs.unmatchedPassword);
      return;
    }
    userService
      .updateById(global.user._id, {$set: {password: password}})
      .then((mr) => snackBar(mr, msgs.passwordSaved));
  };

  return (
    <Grid>
      <Row>
        <Col>
          <ScrollView>
            <Card width="100%">
              <Text text={msgs.defaultAddress} color={theme.secondary} />
              {address.id ? <DefaultAddress /> : <></>}
              <Button
                style={inlineStyle.button}
                label={msgs.manageAddress}
                onPress={() => navigation.navigate('addressListScreen', {})}
              />
            </Card>

            <Card width="100%">
              <PhoneNo />
              <Button
                label={msgs.save}
                onPress={savePhoneNo}
                style={inlineStyle.button}
              />
            </Card>

            <Card width="100%">
              <Password />
              <Button
                label={msgs.changePassword}
                onPress={changePassword}
                style={inlineStyle.button}
              />
            </Card>
          </ScrollView>
          <SnackBar
            msg={snackBarMsg}
            visible={showSnackBar}
            onDismiss={setShowSnackBar}
          />
        </Col>
      </Row>
    </Grid>
  );
};

const inlineStyle = StyleSheet.create({
  text: {width: 150},
  address: {width: 90},
  inputText: {width: '50%'},
  button: {alignSelf: 'flex-end', width: 140},
});
