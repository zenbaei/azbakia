import React, {useContext, useRef, useState} from 'react';
import {View, FlatList, Text, TextInput} from 'react-native';
import {UserContext} from 'user-context';

type data = {value: string; label: string};

interface SearchBarProps {
  onChangeText: (text: string) => Promise<data[]>;
  onSelectItem: (id: string) => void;
}
export const SearchBar = (searchBarProps: SearchBarProps) => {
  const [data, setData] = useState([] as data[]);
  const [text, setText] = useState('');
  const [visible, isVisible] = useState(false);
  const textInput = useRef<TextInput>(null);
  const {theme, msgs} = useContext(UserContext);
  const [listPosition, setListPosition] = useState(0);

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  const searchItems = async (txt: string) => {
    setText(txt);
    if (txt.length < 3) {
      return;
    }
    const searchData = await searchBarProps.onChangeText(txt);
    setData(searchData);
    if (searchData && searchData.length > 0) {
      isVisible(true);
    }
  };

  const _calculatePosition = () => {
    textInput.current?.measure((x, y, width, height, pageX, pageY) => {
      const position = pageX + height;
      setListPosition(position);
      isVisible(false);
    });
  };

  return (
    <>
      <TextInput
        style={{
          width: '95%',
          borderWidth: 1,
          borderColor: theme.primary,
          borderRadius: 25,
          alignSelf: 'center',
          color: theme.onBackground,
        }}
        placeholder={msgs.searchPlaceholder}
        placeholderTextColor={theme.mediumEmphasis}
        onChangeText={searchItems}
        value={text}
        ref={textInput}
      />
      <View
        style={{
          display: visible ? 'flex' : 'none',
        }}>
        <FlatList
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            width: '95%',
            zIndex: 1,
            alignSelf: 'center',
            marginTop: 5,
          }}
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
