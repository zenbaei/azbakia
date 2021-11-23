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
import {Loading} from 'view/loading-component';

export const ProfileScreen = ({
  navigation,
}: NavigationProps<NavigationScreens, 'profileScreen'>) => {
  const {msgs, styles, theme, cart, mobileNoLength} = useContext(UserContext);
  const zenbaeiCtx = useContext(Ctx);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [additionalPhoneNo, setAdditionalPhoneNo] = useState('');
  const [address, setAddress] = useState({} as Address);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [isVisible, setVisible] = useState(true);
  const [isLoading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.profile);
      global.setDisplayCartBtn(cart);
    }, [msgs, cart]),
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
        setVisible(false);
        setLoading(false);
      });
    }, []),
  );

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
    <>
      <Loading visible={isVisible} showLoading={isLoading} />
      <Grid style={isVisible ? styles.hidden : styles.visible}>
        <Row>
          <Col>
            <ScrollView>
              <Card width="100%">
                <Text bold text={msgs.defaultAddress} color={theme.secondary} />
                <View
                  style={[
                    inlineStyle.view,
                    address.id ? inlineStyle.show : inlineStyle.hide,
                  ]}>
                  <Text
                    bold
                    color={theme.secondary}
                    text={msgs.street}
                    align={'left'}
                  />
                  <Text
                    text={address.street}
                    italic
                    style={inlineStyle.paddedText}
                  />

                  <Text
                    bold
                    color={theme.secondary}
                    text={msgs.building}
                    align="left"
                  />
                  <Text
                    italic
                    style={inlineStyle.paddedText}
                    text={address.building}
                  />

                  <Text
                    bold
                    color={theme.secondary}
                    text={msgs.apartment}
                    align="left"
                  />
                  <Text
                    italic
                    style={inlineStyle.paddedText}
                    text={address.apartment}
                  />

                  <Text
                    align="left"
                    bold
                    color={theme.secondary}
                    text={`${address.district}, ${address.city}`}
                  />
                </View>
                <Button
                  align="flex-end"
                  style={inlineStyle.button}
                  label={msgs.manageAddress}
                  onPress={() => navigation.navigate('addressListScreen', {})}
                />
              </Card>

              <Card width="100%">
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
                    onChangeText={(val) => setPhoneNo(val)}
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
                <Button
                  align="flex-end"
                  label={msgs.save}
                  onPress={savePhoneNo}
                  style={inlineStyle.button}
                />
              </Card>

              <Card width="100%">
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
                <Button
                  align="flex-end"
                  label={msgs.changePassword}
                  onPress={changePassword}
                  style={inlineStyle.button}
                />
              </Card>
            </ScrollView>
          </Col>
        </Row>
      </Grid>
      <SnackBar
        msg={snackBarMsg}
        visible={showSnackBar}
        onDismiss={setShowSnackBar}
      />
    </>
  );
};

const inlineStyle = StyleSheet.create({
  text: {width: 150},
  address: {width: 90},
  paddedText: {width: '100%', padding: 5},
  inputText: {width: '50%'},
  button: {alignSelf: 'flex-end', width: 140},
  view: {width: '100%'},
  show: {display: 'flex'},
  hide: {display: 'none'},
});
