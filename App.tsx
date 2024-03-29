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
import {LightTheme} from 'zenbaei-js-lib/constants';
import {ErrorBoundary} from 'view/error-boundary';

//adding icons
library.add(faArrowLeft);
FileLogger.configure({captureConsole: false});

global.FileLog = (msg: string | object) => {
  FileLogger.error(msg as string);
};

global.LogLevel = 'debug';

const App = (): ReactNode => {
  return (
    <Zenbaei useTheme={LightTheme}>
      <UserContextProvider>
        <PaperProvider>
          <NavigationContainer>
            <ErrorBoundary>
              <StackNavigator />
            </ErrorBoundary>
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
    primary: LightTheme.primary,
    secondary: LightTheme.secondary,
    background: LightTheme.background,
  },
};
