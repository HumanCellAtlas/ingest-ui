interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  apiUrl: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'ycbt5RBAgfjxdrVTcom976IQejacp2VN',
  domain: 'humancellatlas.auth0.com',
  callbackURL: window.location.origin + '/callback',
  apiUrl: 'https://dev.data.humancellatlas.org/'
};