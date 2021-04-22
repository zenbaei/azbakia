//const androidEmulator: string = '10.0.2.2';
const ismailiaServer: string = 'zenbaei.ddns.net';
export const mongoRestApi = `https://${ismailiaServer}:3500/api/mongo`;
export const emailRestApi = `https://${ismailiaServer}:3500/api/email`;
export const staticFileUrl = `https://${ismailiaServer}:3500/static`;
export const activationLinkUrl = `${mongoRestApi}/users/activate`;
export const imagesNames: string[] = [
  'main.jpg',
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
];
export const pageSize = 6;
