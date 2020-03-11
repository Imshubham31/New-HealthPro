// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { APP_BASE_HREF } from '@angular/common';
import { JnJRestModule } from '@lib/jnj-rest/jnj-rest.module';
import { configureTestSuite } from 'ng-bullet';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

global.configureTestSuite = configureTestSuite;
// Prevent Karma from running prematurely.
__karma__.loaded = function() {};
// TODO: Solving APP_HREF error in tests
@NgModule({
    imports: [JnJRestModule.init({ baseUrl: 'test' })],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
})
class TestModule {}
// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    [TestModule, BrowserDynamicTestingModule],
    platformBrowserDynamicTesting(),
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
