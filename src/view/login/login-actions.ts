import {User} from 'domain/user/user';
import {userService} from 'domain/user/user-service';
import {email as Email} from 'zenbaei-js-lib/types';
import {EmailHttpService} from 'zenbaei-js-lib/utils';
import {activationLinkUrl, emailRestApi} from '../../../app.config';

const emailService = new EmailHttpService(emailRestApi);

export const emailShouldNotExist = async (email: string): Promise<boolean> => {
  const user = await userService.findOne('email', email);
  if (user) {
    return false;
  }
  return true;
};

export const saveUser = async (
  email: string,
  password: string,
): Promise<boolean> => {
  const result = await userService.insert({
    email: email,
    password: password,
    activated: false,
  } as User);
  return result.modified === 1 ? true : false;
};

export const sendActivationEmail = async (
  email: string,
  subject: string,
  body: string,
): Promise<boolean> => {
  const user = await userService.findOne('email', email);
  if (!user) {
    return false;
  }
  const mailBody = `${body}\n ${activationLinkUrl}/${user._id}`;
  const mail: Email = {
    sender: 'islam zenbaei',
    receiver: email,
    subject: subject,
    body: mailBody,
  };

  return emailService.sendEmail(mail);
};
