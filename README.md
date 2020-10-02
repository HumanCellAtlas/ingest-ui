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
v12.16.2

$ npm --version
6.14.4

$ ng --version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/
    

Angular CLI: 9.1.1
Node: 12.16.2
OS: darwin x64

Angular: 9.1.2
... animations, common, compiler, compiler-cli, core, forms
... language-service, platform-browser, platform-browser-dynamic
... router
Ivy Workspace: Yes

Package                           Version
-----------------------------------------------------------
@angular-devkit/architect         0.901.1
@angular-devkit/build-angular     0.901.1
@angular-devkit/build-optimizer   0.901.1
@angular-devkit/build-webpack     0.901.1
@angular-devkit/core              9.1.1
@angular-devkit/schematics        9.1.1
@angular/cdk                      9.2.1
@angular/cli                      9.1.1
@angular/flex-layout              9.0.0-beta.29
@angular/material                 9.2.1
@ngtools/webpack                  9.1.1
@schematics/angular               9.1.1
@schematics/update                0.901.1
rxjs                              6.5.5
typescript                        3.8.3
webpack                           4.42.0
    
```

## Development server

Run `ng serve` or `ng serve -c=[dev|staging|prod]` for a dev server pointing to the ingest api urls configuration in the `environment.<env>.ts`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

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
