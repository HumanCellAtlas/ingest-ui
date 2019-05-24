import {environment} from "../../environments/environment";

interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  apiUrl: string;
  auth0: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'ycbt5RBAgfjxdrVTcom976IQejacp2VN',
  domain: environment.AUTH_DOMAIN,
  callbackURL: window.location.origin + '/callback',
  apiUrl: 'https://dev.data.humancellatlas.org/',
  auth0: 'humancellatlas.auth0.com'
};
