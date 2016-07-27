"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var testing_1 = require('@angular/core/testing');
var testing_2 = require('@angular/compiler/testing');
var platform_browser_1 = require('@angular/platform-browser');
var toolbar_1 = require('./toolbar');
testing_1.describe('MdToolbar', function () {
    var builder;
    testing_1.beforeEach(testing_1.inject([testing_2.TestComponentBuilder], function (tcb) {
        builder = tcb;
    }));
    testing_1.it('should apply class based on color attribute', function (done) {
        return builder.createAsync(TestApp).then(function (fixture) {
            var testComponent = fixture.debugElement.componentInstance;
            var toolbarDebugElement = fixture.debugElement.query(platform_browser_1.By.css('md-toolbar'));
            testComponent.toolbarColor = 'primary';
            fixture.detectChanges();
            testing_1.expect(toolbarDebugElement.nativeElement.classList.contains('md-primary')).toBe(true);
            testComponent.toolbarColor = 'accent';
            fixture.detectChanges();
            testing_1.expect(toolbarDebugElement.nativeElement.classList.contains('md-primary')).toBe(false);
            testing_1.expect(toolbarDebugElement.nativeElement.classList.contains('md-accent')).toBe(true);
            testComponent.toolbarColor = 'warn';
            fixture.detectChanges();
            testing_1.expect(toolbarDebugElement.nativeElement.classList.contains('md-accent')).toBe(false);
            testing_1.expect(toolbarDebugElement.nativeElement.classList.contains('md-warn')).toBe(true);
            done();
        });
    });
});
var TestApp = (function () {
    function TestApp() {
    }
    TestApp = __decorate([
        core_1.Component({
            selector: 'test-app',
            template: "\n    <md-toolbar [color]=\"toolbarColor\">\n      <span>Test Toolbar</span>\n    </md-toolbar>\n  ",
            directives: [toolbar_1.MdToolbar]
        }), 
        __metadata('design:paramtypes', [])
    ], TestApp);
    return TestApp;
}());
//# sourceMappingURL=toolbar.spec.js.map