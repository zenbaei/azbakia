import {User} from 'domain/user/user';
import {uploadLogFile} from 'email-service';
import {Email} from 'zenbaei-js-lib/types';
import {EmailHttpService, Logger} from 'zenbaei-js-lib/utils';
import {ACTIVATION_API, APP_NAME, EMAIL_API} from '../../../app-config';

const emailService = new EmailHttpService(EMAIL_API);

export const sendActivationEmail = async (
  user: User,
  subject: string,
  body: string,
): Promise<boolean> => {
  const mailBody = `${body}\n ${ACTIVATION_API}/${user._id}`;
  const mail: Email = {
    sender: APP_NAME,
    receiver: user.email,
    subject: subject,
    body: mailBody,
  };

  try {
    await emailService.send(mail);
  } catch (error) {
    Logger.error('login-actions', 'sendActivationEmail', error);
    uploadLogFile();
    return false;
  }

  return true;
};
