# Ingest UI

This is the UI app for monitoring and tracking submissions to the DCP. 

## Development server

Run `ng serve --env=[local|dev|staging]` for a dev server pointing to the ingest api urls configuration in the `environment.<env>.ts`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Deploy

To deploy, run the ff:
 ```
 source deploy.sh <dev|integration|staging|prod>
 ```

Try running following commands if there are errors encountered in installing node packages:
```
rm -rf node_modules
rm package-lock.json
npm cache verify
npm install
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Resources Used

* [CloudFront Setup](https://keita.blog/2015/11/24/hosting-a-single-page-app-on-s3-with-proper-urls/)