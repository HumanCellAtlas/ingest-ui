import {environment} from "../../environments/environment";
import {AuthConfig} from "./auth.model";


export const AUTH_CONFIG: AuthConfig = {
  domain: environment.AUTH_DOMAIN,
  callbackUrl: window.location.origin + '/callback',
  apiUrl: 'https://dev.data.humancellatlas.org/'
};



// When testing silent authentication locally
// modifying your /etc/hosts file to add an entry such as the following:
//
//   127.0.0.1       myapp.example
//
// See https://auth0.com/docs/api-auth/user-consent#skipping-consent-for-first-party-applications
//     https://auth0.com/docs/api-auth/tutorials/silent-authentication

// if (AUTH_CONFIG.callbackUrl.startsWith('http://localhost')){
//   AUTH_CONFIG.callbackUrl = 'http://myapp.example:4200/callback'
// }


