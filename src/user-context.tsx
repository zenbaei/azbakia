// CounterContext.tsx
import {
  getMessages,
  MessagesInterface,
} from 'constants/in18/messages-interface';
import {Cart} from 'domain/user/cart';
import React, {useCallback, useContext, useState} from 'react';
import {Ctx} from 'zenbaei-js-lib/react';
import {AppThemeInterface} from 'zenbaei-js-lib/constants';
import {getStyles} from 'constants/styles';
import {
  Config,
  getCurrency,
  getImgFileNames,
  getMobileNoLength,
  getPageSize,
} from 'domain/config/config';

interface UserProps {
  cart: Cart[];
  setCart: (crt: Cart[]) => void;
  favs: string[];
  setFavs: (fvs: string[]) => void;
  setConfigs: (configs: Config[]) => void;
  msgs: MessagesInterface;
  theme: AppThemeInterface;
  language: Language;
  styles: ReturnType<typeof getStyles>;
  pageSize: number;
  imgFileNames: string[];
  currency: string;
  mobileNoLength: number;
}
/*
export const initialValue: UserProps = {
  cart: [],
  favs: [],
  setCart: () => {},
  setFavs: () => {},
  setConfigs: () => {},
  configs: [],
  msgs: {} as MessagesInterface,
  theme: {} as AppThemeInterface,
  language: 'en',
  styles: getStyles(DarkTheme),
  pageSize: 6,
  imgFileNames: [],
  currency: 'EGP',
  mobileNoLength: 10,
};
*/

export const UserContext = React.createContext<UserProps>({} as UserProps);

export const UserContextProvider = ({children}: {children: any}) => {
  const [cart, updCart] = useState([] as Cart[]);
  const [favs, updFavs] = useState([] as string[]);
  const [pageSize, setPageSize] = useState(6);
  const [currency, setCurrency] = useState('EGP');
  const [imgFileNames, setImgFileNames] = useState([] as string[]);
  const [mobileNoLength, setMobileNoLength] = useState(10);
  const {language, theme} = useContext(Ctx);
  const msgs = getMessages(language);
  const styles = getStyles(theme);

  const setCart = useCallback((car: Cart[]) => updCart(car), []);
  const setFavs = useCallback((fvs: string[]) => updFavs(fvs), []);
  const setConfigs = useCallback((cfgs) => {
    setPageSize(getPageSize(cfgs));
    setCurrency(getCurrency(global.user.country, cfgs));
    setImgFileNames(getImgFileNames(cfgs));
    setMobileNoLength(getMobileNoLength(cfgs));
  }, []);

  const val = {
    cart,
    favs,
    setCart,
    setFavs,
    setConfigs,
    msgs,
    theme,
    language,
    styles,
    pageSize,
    currency,
    imgFileNames,
    mobileNoLength,
  };

  return <UserContext.Provider value={val}>{children}</UserContext.Provider>;
};
