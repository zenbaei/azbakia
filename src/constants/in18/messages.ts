import {Messages} from './messages-en';

const messages: Messages = new Messages();

export const getMessages = (): Messages => {
  return messages;
};
