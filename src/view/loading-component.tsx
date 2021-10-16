import React, {useContext} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {UserContext} from 'user-context';
import {Text} from 'zenbaei-js-lib/react';

export const Loading = ({
  showLoading = true,
  text = '',
  visible = false,
}: {
  showLoading: boolean;
  text?: string;
  visible: boolean;
}) => {
  const {styles, theme} = useContext(UserContext);
  return (
    <View
      style={[
        visible ? styles.visible : styles.hidden,
        {backgroundColor: theme.background},
      ]}>
      <ActivityIndicator animating={showLoading} color={theme.secondary} />
      {text ? (
        <Text
          text={text}
          visible={!showLoading}
          mediumEmphasis
          align="center"
        />
      ) : (
        <></>
      )}
    </View>
  );
};
