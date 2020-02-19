export const environment = {
  production: false,
  INGEST_API_URL: 'https://api.ingest.staging.data.humancellatlas.org',
  BROKER_API_URL: 'https://ingest.staging.data.humancellatlas.org',
  SCHEMA_API_URL: 'https://schema.humancellatlas.org',
  DSS_API_URL: 'https://dss.staging.data.humancellatlas.org',
  DOMAIN_WHITELIST: 'api.ingest.staging.data.humancellatlas.org,ingest.staging.data.humancellatlas.org',
  // AAI
  AAI_CLIENT_ID: '',
  AAI_AUTHORITY: 'https://login.elixir-czech.org/oidc',
  AAI_REDIRECT_URI:  'http://localhost:4200/aai-callback',
  AAI_POST_LOGOUT_REDIRECT_URI: 'http://localhost:4200/'
};
