/// <reference path="../typings/_custom.d.ts" />
import {Component, bootstrap} from 'angular2/angular2';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {Main} from './main';

bootstrap(Main, [
    ROUTER_PROVIDERS
]);
