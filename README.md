[![Build Status](https://travis-ci.org/HumanCellAtlas/ingest-ui.svg?branch=master)](https://travis-ci.org/HumanCellAtlas/ingest-ui)
[![Docker Repository on Quay](https://quay.io/repository/humancellatlas/ingest-ui/status "Docker Repository on Quay")](https://quay.io/repository/humancellatlas/ingest-ui)

# Ingest UI

This is the UI app for monitoring and tracking submissions to the DCP. 

## Setting up
1. Install `nvm` to install node.https://github.com/nvm-sh/nvm
2. Clone this repo
3. cd to /client
4. `npm install`
5. `ng serve -c=dev` (quickly check if UI is working, this will point to Ingest API in dev)

(Optional) if you're just updating your setup, do the ff before npm install:

```
rm -rf node_modules/
npm cache verify

```

Currently working with the ff versions:

```
$ node --version
v12.7.0

$ npm --version
6.10.0

$ ng --version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/
    

Angular CLI: 8.1.0
Node: 12.7.0
OS: darwin x64
Angular: undefined
... 

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.801.0 (cli-only)
@angular-devkit/core         8.1.0 (cli-only)
@angular-devkit/schematics   8.1.0 (cli-only)
@schematics/angular          8.1.0 (cli-only)
@schematics/update           0.801.0 (cli-only)
rxjs                         6.5.2

```

## Development server

Run `ng serve -c=[local|dev|integration|staging|prod]` for a dev server pointing to the ingest api urls configuration in the `environment.<env>.ts`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Deployment
Please check `ingest-kube-deployment` repo

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
