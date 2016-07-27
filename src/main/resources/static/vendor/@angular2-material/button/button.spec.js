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
var testing_1 = require('@angular/core/testing');
var testing_2 = require('@angular/compiler/testing');
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var button_1 = require('./button');
testing_1.describe('MdButton', function () {
    var builder;
    testing_1.beforeEach(testing_1.inject([testing_2.TestComponentBuilder], function (tcb) {
        builder = tcb;
    }));
    // General button tests
    testing_1.it('should apply class based on color attribute', function (done) {
        return builder.createAsync(TestApp).then(function (fixture) {
            var testComponent = fixture.debugElement.componentInstance;
            var buttonDebugElement = fixture.debugElement.query(platform_browser_1.By.css('button'));
            var aDebugElement = fixture.debugElement.query(platform_browser_1.By.css('a'));
            testComponent.buttonColor = 'primary';
            fixture.detectChanges();
            testing_1.expect(buttonDebugElement.nativeElement.classList.contains('md-primary')).toBe(true);
            testing_1.expect(aDebugElement.nativeElement.classList.contains('md-primary')).toBe(true);
            testComponent.buttonColor = 'accent';
            fixture.detectChanges();
            testing_1.expect(buttonDebugElement.nativeElement.classList.contains('md-accent')).toBe(true);
            testing_1.expect(aDebugElement.nativeElement.classList.contains('md-accent')).toBe(true);
            done();
        });
    });
    testing_1.it('should should not clear previous defined classes', function (done) {
        return builder.createAsync(TestApp).then(function (fixture) {
            var testComponent = fixture.debugElement.componentInstance;
            var buttonDebugElement = fixture.debugElement.query(platform_browser_1.By.css('button'));
            buttonDebugElement.nativeElement.classList.add('custom-class');
            testComponent.buttonColor = 'primary';
            fixture.detectChanges();
            testing_1.expect(buttonDebugElement.nativeElement.classList.contains('md-primary')).toBe(true);
            testing_1.expect(buttonDebugElement.nativeElement.classList.contains('custom-class')).toBe(true);
            testComponent.buttonColor = 'accent';
            fixture.detectChanges();
            testing_1.expect(buttonDebugElement.nativeElement.classList.contains('md-primary')).toBe(false);
            testing_1.expect(buttonDebugElement.nativeElement.classList.contains('md-accent')).toBe(true);
            testing_1.expect(buttonDebugElement.nativeElement.classList.contains('custom-class')).toBe(true);
            done();
        });
    });
    // Regular button tests
    testing_1.describe('button[md-button]', function () {
        testing_1.it('should handle a click on the button', function (done) {
            return builder.createAsync(TestApp).then(function (fixture) {
                var testComponent = fixture.debugElement.componentInstance;
                var buttonDebugElement = fixture.debugElement.query(platform_browser_1.By.css('button'));
                buttonDebugElement.nativeElement.click();
                testing_1.expect(testComponent.clickCount).toBe(1);
                done();
            });
        });
        testing_1.it('should not increment if disabled', function (done) {
            return builder.createAsync(TestApp).then(function (fixture) {
                var testComponent = fixture.debugElement.componentInstance;
                var buttonDebugElement = fixture.debugElement.query(platform_browser_1.By.css('button'));
                testComponent.isDisabled = true;
                fixture.detectChanges();
                buttonDebugElement.nativeElement.click();
                testing_1.expect(testComponent.clickCount).toBe(0);
                done();
            });
        });
    });
    // Anchor button tests
    testing_1.describe('a[md-button]', function () {
        testing_1.it('should not redirect if disabled', function (done) {
            return builder.createAsync(TestApp).then(function (fixture) {
                var testComponent = fixture.debugElement.componentInstance;
                var buttonDebugElement = fixture.debugElement.query(platform_browser_1.By.css('a'));
                testComponent.isDisabled = true;
                fixture.detectChanges();
                buttonDebugElement.nativeElement.click();
                // will error if page reloads
                done();
            });
        });
        testing_1.it('should remove tabindex if disabled', function (done) {
            return builder.createAsync(TestApp).then(function (fixture) {
                var testComponent = fixture.debugElement.componentInstance;
                var buttonDebugElement = fixture.debugElement.query(platform_browser_1.By.css('a'));
                testing_1.expect(buttonDebugElement.nativeElement.getAttribute('tabIndex')).toBe(null);
                testComponent.isDisabled = true;
                fixture.detectChanges();
                testing_1.expect(buttonDebugElement.nativeElement.getAttribute('tabIndex')).toBe('-1');
                done();
            });
        });
        testing_1.it('should add aria-disabled attribute if disabled', function (done) {
            return builder.createAsync(TestApp).then(function (fixture) {
                var testComponent = fixture.debugElement.componentInstance;
                var buttonDebugElement = fixture.debugElement.query(platform_browser_1.By.css('a'));
                fixture.detectChanges();
                testing_1.expect(buttonDebugElement.nativeElement.getAttribute('aria-disabled')).toBe('false');
                testComponent.isDisabled = true;
                fixture.detectChanges();
                testing_1.expect(buttonDebugElement.nativeElement.getAttribute('aria-disabled')).toBe('true');
                done();
            });
        });
    });
});
/** Test component that contains an MdButton. */
var TestApp = (function () {
    function TestApp() {
        this.clickCount = 0;
        this.isDisabled = false;
    }
    TestApp.prototype.increment = function () {
        this.clickCount++;
    };
    TestApp = __decorate([
        core_1.Component({
            selector: 'test-app',
            template: "\n    <button md-button type=\"button\" (click)=\"increment()\"\n      [disabled]=\"isDisabled\" [color]=\"buttonColor\">\n      Go\n    </button>\n    <a href=\"http://www.google.com\" md-button [disabled]=\"isDisabled\" [color]=\"buttonColor\">Link</a>\n  ",
            directives: [button_1.MdButton, button_1.MdAnchor]
        }), 
        __metadata('design:paramtypes', [])
    ], TestApp);
    return TestApp;
}());
//# sourceMappingURL=button.spec.js.map