import 'react-native-gesture-handler';
import {
  NavigationContainer,
  DarkTheme as NavDarkTheme,
} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FileLogger} from 'react-native-file-logger';
import {StackNavigator} from 'view/navigator/stack-navigator';
import {
  DarkTheme as PapDarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {getAppTheme} from 'zenbaei-js-lib/theme';

//adding icons
library.add(faArrowLeft);
FileLogger.configure({captureConsole: false});
global.FileLog = (msg: string | object) => {
  FileLogger.error(msg as string);
};

global.LogLevel = 'Debug';

const App = (): ReactNode => {
  return (
    <PaperProvider theme={CombinedDarkTheme}>
      <NavigationContainer theme={CombinedDarkTheme}>
        <StackNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;

const CombinedDarkTheme = {
  ...PapDarkTheme,
  ...NavDarkTheme,
  colors: {
    ...PapDarkTheme.colors,
    ...NavDarkTheme.colors,
    primary: getAppTheme().primary,
  },
};
