import {getStyles} from 'constants/styles';
import React, {useContext, useRef, useState} from 'react';

import {View, FlatList, Text, TextInput} from 'react-native';
import IconButton from 'react-native-paper/src/components/IconButton';
import {UserContext} from 'user-context';

type data = {value: string; label: string};

interface SearchBarProps {
  /**
   * @property text: passes the input text.
   * @returns data: to be displayed as search result.
   */
  onChangeText: (text: string) => Promise<data[]>;
  /**
   * @property id: passes the id of the selected item.
   */
  onSelectItem: (id: string) => void;
  /**
   * @property text: passes the input text.
   */
  onBlur: (text: string) => void;

  minLength: number;
}
export const SearchBar = (searchBarProps: SearchBarProps) => {
  const [data, setData] = useState([] as data[]);
  const [text, setText] = useState('');
  const [visible, isVisible] = useState(false);
  const textInput = useRef<TextInput>(null);
  const {theme, msgs} = useContext(UserContext);
  //const [listPosition, setListPosition] = useState(0);

  const renderSeparator = () => {
    return <View style={getStyles(theme).searchSeparator} />;
  };

  const onChangeTextHandler = async (txt: string) => {
    isVisible(false);
    setText(txt);
    if (txt.length < searchBarProps.minLength) {
      return;
    }
    const searchData = await searchBarProps.onChangeText(txt);
    setData(searchData);
    if (searchData && searchData.length > 0) {
      isVisible(true);
    }
  };

  const onBlurHandler = (): void => {
    isVisible(false);
    if (!text || text.trim().length === 0) {
      return;
    }
    searchBarProps.onBlur(text);
  };

  const isListDisplayed = (): any => {
    return {
      display: visible ? 'flex' : 'none',
    };
  };

  /*
  const _calculatePosition = () => {
    textInput.current?.measure((x, y, width, height, pageX, pageY) => {
      const position = pageX + height;
      setListPosition(position);
      isVisible(false);
    });
  */

  return (
    <>
      <TextInput
        testID="searchInput"
        style={getStyles(theme).searchInput}
        placeholder={msgs.searchPlaceholder}
        placeholderTextColor={theme.mediumEmphasis}
        onChangeText={onChangeTextHandler}
        onBlur={onBlurHandler}
        value={text}
        ref={textInput}
      />
      <IconButton
        icon={'close'}
        onPress={() => {
          setText('');
          isVisible(false);
        }}
        style={{position: 'absolute', top: 2, right: 8}}
      />
      <View style={isListDisplayed()}>
        <FlatList
          style={getStyles(theme).searchResult}
          data={data}
          renderItem={({item}) => (
            <Text
              style={{padding: 10}}
              onPress={() => {
                setText(item.label);
                isVisible(false);
                searchBarProps.onSelectItem(item.value);
              }}>
              {item.label}
            </Text>
          )}
          keyExtractor={(item) => item.value}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
    </>
  );
};
