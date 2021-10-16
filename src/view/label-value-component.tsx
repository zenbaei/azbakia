import React, {useContext} from 'react';
import {View, ViewStyle} from 'react-native';
import {UserContext} from 'user-context';
import {Text} from 'zenbaei-js-lib/react';

export const LabelValue = ({
  label,
  value,
  style,
  align = 'flex-start',
}: {
  label: string;
  value: string | number;
  style?: ViewStyle;
  align?: 'flex-start' | 'center' | 'flex-end';
}) => {
  const {styles, theme} = useContext(UserContext);
  return (
    <View style={[styles.viewRow, style, {justifyContent: align}]}>
      <Text text={`${label}: `} color={theme.secondary} />
      <Text text={value} />
    </View>
  );
};
