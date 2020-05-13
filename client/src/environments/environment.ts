// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  INGEST_API_URL: 'http://localhost:8080',
  BROKER_API_URL: 'http://localhost:5000',
  SCHEMA_API_URL: 'https://schema.humancellatlas.org',
  DSS_API_URL: 'https://dss.dev.data.humancellatlas.org',
  DOMAIN_WHITELIST: 'localhost:8080,localhost:5000',
  // AAI
  AAI_CLIENT_ID: '',
  AAI_AUTHORITY: 'https://login.elixir-czech.org/oidc',

  OLS_URL: 'https://ontology.dev.archive.data.humancellatlas.org'
};
