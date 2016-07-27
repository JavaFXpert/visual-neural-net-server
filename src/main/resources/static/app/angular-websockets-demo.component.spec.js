"use strict";
var testing_1 = require('@angular/core/testing');
var angular_websockets_demo_component_1 = require('../app/angular-websockets-demo.component');
testing_1.beforeEachProviders(function () { return [angular_websockets_demo_component_1.AngularWebsocketsDemoAppComponent]; });
testing_1.describe('App: AngularWebsocketsDemo', function () {
    testing_1.it('should create the app', testing_1.inject([angular_websockets_demo_component_1.AngularWebsocketsDemoAppComponent], function (app) {
        testing_1.expect(app).toBeTruthy();
    }));
    testing_1.it('should have as title \'angular-websockets-demo works!\'', testing_1.inject([angular_websockets_demo_component_1.AngularWebsocketsDemoAppComponent], function (app) {
    }));
});
//# sourceMappingURL=angular-websockets-demo.component.spec.js.map