const ANDROID_LOCALHOST = '10.0.2.2';
const REOMTE_SERVER = 'zenbaei.ddns.net';
const SERVER_PORT = '3500';
const SERVER = REOMTE_SERVER;
const BASE_REST_API = `http://${SERVER}:${SERVER_PORT}`;
export const APP_REST_API = `${BASE_REST_API}/api/azbakia`;
export const EMAIL_REST_API = `${BASE_REST_API}/api/email`;
export const STATIC_FILES_URL = `${BASE_REST_API}/tmp/images`;
