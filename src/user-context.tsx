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
  getMobileNoLength,
  getPageSize,
  getShipmentCollectionDays,
} from 'domain/config/config';

interface UserProps {
  cart: Cart;
  setCart: (cart: Cart) => void;
  favs: string[];
  setFavs: (fvs: string[]) => void;
  setConfigs: (configs: Config[]) => void;
  setCurrency: (c: string) => void;
  msgs: MessagesInterface;
  theme: AppThemeInterface;
  language: Language;
  styles: ReturnType<typeof getStyles>;
  pageSize: number;
  mobileNoLength: number;
  currency: string;
  shipmentCollectionDays: number;
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
  const [cart, updCart] = useState({} as Cart);
  const [favs, updFavs] = useState([] as string[]);
  const [pageSize, setPageSize] = useState(6);
  const [shipmentCollectionDays, setShipmentCollectionDays] = useState(0);
  const [currency, updCurrency] = useState('EGP');
  const [mobileNoLength, setMobileNoLength] = useState(10);
  const {language, theme} = useContext(Ctx);
  const msgs = getMessages(language);
  const styles = getStyles(theme);

  const setCart = useCallback((car: Cart) => updCart(car), []);
  const setFavs = useCallback((fvs: string[]) => updFavs(fvs), []);
  const setConfigs = useCallback((cfgs: Config[]) => {
    setPageSize(getPageSize(cfgs));
    setMobileNoLength(getMobileNoLength(cfgs));
    setShipmentCollectionDays(getShipmentCollectionDays(cfgs));
  }, []);
  const setCurrency = useCallback((c: string) => {
    updCurrency(c);
  }, []);

  const val = {
    cart,
    favs,
    setCart,
    setFavs,
    setConfigs,
    setCurrency,
    msgs,
    theme,
    language,
    styles,
    pageSize,
    currency,
    shipmentCollectionDays,
    mobileNoLength,
  };

  return <UserContext.Provider value={val}>{children}</UserContext.Provider>;
};
