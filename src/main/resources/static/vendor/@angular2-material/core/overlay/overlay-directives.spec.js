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
var overlay_directives_1 = require('./overlay-directives');
var overlay_1 = require('./overlay');
var viewport_ruler_1 = require('./position/viewport-ruler');
var overlay_position_builder_1 = require('./position/overlay-position-builder');
var connected_position_strategy_1 = require('./position/connected-position-strategy');
testing_1.describe('Overlay directives', function () {
    var builder;
    var overlayContainerElement;
    var fixture;
    testing_1.beforeEachProviders(function () { return [
        overlay_1.Overlay,
        overlay_position_builder_1.OverlayPositionBuilder,
        viewport_ruler_1.ViewportRuler,
        core_1.provide(overlay_1.OVERLAY_CONTAINER_TOKEN, { useFactory: function () {
                overlayContainerElement = document.createElement('div');
                return overlayContainerElement;
            } })
    ]; });
    testing_1.beforeEach(testing_1.inject([testing_2.TestComponentBuilder], function (tcb) {
        builder = tcb;
    }));
    testing_1.beforeEach(testing_1.async(function () {
        builder.createAsync(ConnectedOverlayDirectiveTest).then(function (f) {
            fixture = f;
            fixture.detectChanges();
        });
    }));
    testing_1.it("should create an overlay and attach the directive's template", function () {
        testing_1.expect(overlayContainerElement.textContent).toContain('Menu content');
    });
    testing_1.it('should destroy the overlay when the directive is destroyed', testing_1.fakeAsync(function () {
        fixture.destroy();
        testing_1.flushMicrotasks();
        testing_1.expect(overlayContainerElement.textContent.trim()).toBe('');
    }));
    testing_1.it('should use a connected position strategy with a default set of positions', function () {
        var testComponent = fixture.debugElement.componentInstance;
        var overlayDirective = testComponent.connectedOverlayDirective;
        var strategy = overlayDirective.overlayRef.getState().positionStrategy;
        testing_1.expect(strategy).toEqual(jasmine.any(connected_position_strategy_1.ConnectedPositionStrategy));
        var positions = strategy.positions;
        testing_1.expect(positions.length).toBeGreaterThan(0);
    });
});
var ConnectedOverlayDirectiveTest = (function () {
    function ConnectedOverlayDirectiveTest() {
    }
    __decorate([
        core_1.ViewChild(overlay_directives_1.ConnectedOverlayDirective), 
        __metadata('design:type', overlay_directives_1.ConnectedOverlayDirective)
    ], ConnectedOverlayDirectiveTest.prototype, "connectedOverlayDirective", void 0);
    ConnectedOverlayDirectiveTest = __decorate([
        core_1.Component({
            template: "\n  <button overlay-origin #trigger=\"overlayOrigin\">Toggle menu</button>\n  <template connected-overlay [origin]=\"trigger\">\n    <p>Menu content</p>\n  </template>",
            directives: [overlay_directives_1.ConnectedOverlayDirective, overlay_directives_1.OverlayOrigin],
        }), 
        __metadata('design:paramtypes', [])
    ], ConnectedOverlayDirectiveTest);
    return ConnectedOverlayDirectiveTest;
}());
//# sourceMappingURL=overlay-directives.spec.js.map