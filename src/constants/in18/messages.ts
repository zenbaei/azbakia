import {MessagesEn} from './messages-en';

export const getMessages = () => {
  return MessagesEn;
};

export const getMessage = (key: string): string => {
  return MessagesEn[key];
};
