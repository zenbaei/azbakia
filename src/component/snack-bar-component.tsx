import React, {useContext} from 'react';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {UserContext} from 'user-context';

export const SnackBar = ({
  show,
  msg,
  onDismiss,
}: {
  show: boolean;
  msg: string;
  onDismiss: () => void;
}) => {
  const {theme} = useContext(UserContext);
  return (
    <Snackbar
      duration={2000}
      style={{
        backgroundColor: theme.secondary,
      }}
      visible={show}
      onDismiss={onDismiss}>
      {msg}
    </Snackbar>
  );
};
