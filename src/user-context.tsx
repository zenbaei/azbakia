// CounterContext.tsx
import {
  getMessages,
  MessagesInterface,
} from 'constants/in18/messages-interface';
import {Cart} from 'domain/user/user';
import React, {useCallback, useContext, useState} from 'react';
import {Ctx} from 'zenbaei-js-lib/react';
import {AppThemeInterface} from 'zenbaei-js-lib/constants';

interface UserProps {
  cart: Cart[];
  setCart: (car: Cart[]) => void;
  favs: string[];
  setFavs: (fvs: string[]) => void;
  msgs: MessagesInterface;
  theme: AppThemeInterface;
  language: Language;
}

const initialValue: UserProps = {
  cart: [],
  favs: [],
  setCart: () => {},
  setFavs: () => {},
  msgs: {} as MessagesInterface,
  theme: {} as AppThemeInterface,
  language: 'en',
};

export const UserContext = React.createContext<UserProps>(initialValue);

export const UserContextProvider = (props: any) => {
  const [cart, updCart] = useState([] as Cart[]);
  const [favs, updFavs] = useState([] as string[]);
  const {language, theme} = useContext(Ctx);
  const msgs = getMessages(language);

  const setCart = useCallback((car: Cart[]) => updCart(car), []);
  const setFavs = useCallback((fvs: string[]) => updFavs(fvs), []);

  const val = {cart, favs, setCart, setFavs, msgs, theme, language};

  return (
    <UserContext.Provider value={val}>{props.children}</UserContext.Provider>
  );
};
