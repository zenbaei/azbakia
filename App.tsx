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
import {UserContextProvider} from 'user-context';
import {Zenbaei} from 'zenbaei-js-lib/react';
import {DarkTheme} from 'zenbaei-js-lib/constants';

//adding icons
library.add(faArrowLeft);
FileLogger.configure({captureConsole: false});

global.FileLog = (msg: string | object) => {
  FileLogger.error(msg as string);
};

global.LogLevel = 'Debug';

const App = (): ReactNode => {
  return (
    <Zenbaei>
      <UserContextProvider>
        <PaperProvider theme={CombinedDarkTheme}>
          <NavigationContainer theme={CombinedDarkTheme}>
            <StackNavigator />
          </NavigationContainer>
        </PaperProvider>
      </UserContextProvider>
    </Zenbaei>
  );
};

export default App;

const CombinedDarkTheme = {
  ...PapDarkTheme,
  ...NavDarkTheme,
  colors: {
    ...PapDarkTheme.colors,
    ...NavDarkTheme.colors,
    primary: DarkTheme.primary,
  },
};
