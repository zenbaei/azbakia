import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FileLogger} from 'react-native-file-logger';
import {StackNavigator} from 'view/navigator/stack-navigator';

//adding icons
library.add(faArrowLeft);
FileLogger.configure({captureConsole: false});
global.FileLog = (msg: string | object) => {
  FileLogger.error(msg as string);
};

global.LogLevel = 'Debug';

const App = (): ReactNode => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default App;
