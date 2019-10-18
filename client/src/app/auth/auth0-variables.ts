import {environment} from "../../environments/environment";
import {AuthConfig} from "./auth.model";


export const AUTH_CONFIG: AuthConfig = {
  domain: environment.AUTH_DOMAIN,
  callbackUrl: window.location.origin + '/callback',
  apiUrl: 'https://dev.data.humancellatlas.org/'
};
