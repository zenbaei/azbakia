// CounterContext.tsx
import {
  getMessages,
  MessagesInterface,
} from 'constants/in18/messages-interface';
import {Cart} from 'domain/user/user';
import React, {useCallback, useContext, useState} from 'react';
import {Ctx} from 'zenbaei-js-lib/react';
import {AppThemeInterface, DarkTheme} from 'zenbaei-js-lib/constants';
import {getStyles} from 'constants/styles';

interface UserProps {
  cart: Cart[];
  setCart: (crt: Cart[]) => void;
  favs: string[];
  setFavs: (fvs: string[]) => void;
  msgs: MessagesInterface;
  theme: AppThemeInterface;
  language: Language;
  styles: ReturnType<typeof getStyles>;
}

export const initialValue: UserProps = {
  cart: [],
  favs: [],
  setCart: () => {},
  setFavs: () => {},
  msgs: {} as MessagesInterface,
  theme: {} as AppThemeInterface,
  language: 'en',
  styles: getStyles(DarkTheme),
};

export const UserContext = React.createContext<UserProps>(initialValue);

export const UserContextProvider = ({children}: {children: any}) => {
  const [cart, updCart] = useState([] as Cart[]);
  const [favs, updFavs] = useState([] as string[]);
  const {language, theme} = useContext(Ctx);
  const msgs = getMessages(language);
  const styles = getStyles(theme);

  const setCart = useCallback((car: Cart[]) => updCart(car), []);
  const setFavs = useCallback((fvs: string[]) => updFavs(fvs), []);

  const val = {cart, favs, setCart, setFavs, msgs, theme, language, styles};

  return <UserContext.Provider value={val}>{children}</UserContext.Provider>;
};
