import {MessagesInterface} from 'constants/in18/messages-interface';
import {Alert as RNAlert, AlertButton} from 'react-native';

export const Alert = (
  title: string,
  message: string,
  msgs?: MessagesInterface,
  action?: () => void,
): void => {
  const yesBtn: AlertButton = {
    text: msgs?.yes,
    onPress: () => {
      action ? action() : {};
    },
  };
  const noBtn: AlertButton = {text: msgs?.no};

  const btns = msgs ? ([yesBtn, noBtn] as AlertButton[]) : undefined;
  RNAlert.alert(title, message, btns);
};
