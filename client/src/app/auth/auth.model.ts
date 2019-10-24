export interface UserInfo {
  sub: string;
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  locale: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
}

export interface AuthConfig {
  domain: string;
  callbackUrl: string;
  apiUrl: string;
}


export interface OpenIdConfig {
  authorization_endpoint?: string;
  claims_supported?: string[];
  code_challenge_methods_supported?: string[];
  device_authorization_endpoint?: string;
  id_token_signing_alg_values_supported?: string[];
  issuer?: string;
  jwks_uri?: string;
  logout_endpoint?: string;
  mfa_challenge_endpoint?: string;
  registration_endpoint?: string;
  request_uri_parameter_supported?: boolean;
  response_modes_supported?: string[];
  response_types_supported?: string[];
  revocation_endpoint?: string;
  scopes_supported?: string[];
  subject_types_supported?: string[];
  token_endpoint?: string;
  token_endpoint_auth_methods_supported?: string[];
  userinfo_endpoint?: string;
}
