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
var live_announcer_1 = require('./live-announcer');
testing_1.describe('MdLiveAnnouncer', function () {
    var live;
    var builder;
    var liveEl;
    testing_1.beforeEachProviders(function () { return [live_announcer_1.MdLiveAnnouncer]; });
    testing_1.beforeEach(testing_1.inject([testing_2.TestComponentBuilder, live_announcer_1.MdLiveAnnouncer], function (tcb, _live) {
        builder = tcb;
        live = _live;
        liveEl = getLiveElement();
    }));
    afterEach(function () {
        // In our tests we always remove the current live element, because otherwise we would have
        // multiple live elements due multiple service instantiations.
        liveEl.parentNode.removeChild(liveEl);
    });
    testing_1.it('should correctly update the announce text', fakeAsyncTest(function () {
        var appFixture = null;
        builder.createAsync(TestApp).then(function (fixture) {
            appFixture = fixture;
        });
        testing_1.flushMicrotasks();
        var buttonElement = appFixture.debugElement
            .query(platform_browser_1.By.css('button')).nativeElement;
        buttonElement.click();
        // This flushes our 100ms timeout for the screenreaders.
        testing_1.tick(100);
        testing_1.expect(liveEl.textContent).toBe('Test');
    }));
    testing_1.it('should correctly update the politeness attribute', fakeAsyncTest(function () {
        var appFixture = null;
        builder.createAsync(TestApp).then(function (fixture) {
            appFixture = fixture;
        });
        testing_1.flushMicrotasks();
        live.announce('Hey Google', 'assertive');
        // This flushes our 100ms timeout for the screenreaders.
        testing_1.tick(100);
        testing_1.expect(liveEl.textContent).toBe('Hey Google');
        testing_1.expect(liveEl.getAttribute('aria-live')).toBe('assertive');
    }));
    testing_1.it('should apply the aria-live value polite by default', fakeAsyncTest(function () {
        var appFixture = null;
        builder.createAsync(TestApp).then(function (fixture) {
            appFixture = fixture;
        });
        testing_1.flushMicrotasks();
        live.announce('Hey Google');
        // This flushes our 100ms timeout for the screenreaders.
        testing_1.tick(100);
        testing_1.expect(liveEl.textContent).toBe('Hey Google');
        testing_1.expect(liveEl.getAttribute('aria-live')).toBe('polite');
    }));
    testing_1.it('should allow to use a custom live element', fakeAsyncTest(function () {
        var customLiveEl = document.createElement('div');
        // We need to reset our test injector here, because it is already instantiated above.
        testing_1.getTestInjector().reset();
        testing_1.getTestInjector().addProviders([
            core_1.provide(live_announcer_1.LIVE_ANNOUNCER_ELEMENT_TOKEN, { useValue: customLiveEl }),
            live_announcer_1.MdLiveAnnouncer
        ]);
        var injector = testing_1.getTestInjector().createInjector();
        var liveService = injector.get(live_announcer_1.MdLiveAnnouncer);
        liveService.announce('Custom Element');
        // This flushes our 100ms timeout for the screenreaders.
        testing_1.tick(100);
        testing_1.expect(customLiveEl.textContent).toBe('Custom Element');
    }));
});
function fakeAsyncTest(fn) {
    return testing_1.inject([], testing_1.fakeAsync(fn));
}
function getLiveElement() {
    return document.body.querySelector('.md-live-announcer');
}
var TestApp = (function () {
    function TestApp(live) {
        this.live = live;
    }
    ;
    TestApp.prototype.announceText = function (message) {
        this.live.announce(message);
    };
    TestApp = __decorate([
        core_1.Component({
            selector: 'test-app',
            template: "<button (click)=\"announceText('Test')\">Announce</button>",
        }), 
        __metadata('design:paramtypes', [live_announcer_1.MdLiveAnnouncer])
    ], TestApp);
    return TestApp;
}());
//# sourceMappingURL=live-announcer.spec.js.map