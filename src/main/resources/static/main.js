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
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
//import {disableDeprecatedForms, provideForms} from '@angular/forms';
var core_2 = require('@angular/core');
var angular_websockets_demo_component_1 = require('./app/angular-websockets-demo.component');
var environment_1 = require('./app/environment');
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
var LayoutDirective = (function () {
    function LayoutDirective() {
        this.display = 'flex';
    }
    Object.defineProperty(LayoutDirective.prototype, "direction", {
        get: function () {
            return (this.layout === 'column') ? 'column' : 'row';
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_2.Input(), 
        __metadata('design:type', String)
    ], LayoutDirective.prototype, "layout", void 0);
    __decorate([
        core_2.HostBinding('style.display'), 
        __metadata('design:type', Object)
    ], LayoutDirective.prototype, "display", void 0);
    __decorate([
        core_2.HostBinding('style.flex-direction'), 
        __metadata('design:type', Object)
    ], LayoutDirective.prototype, "direction", null);
    LayoutDirective = __decorate([
        core_2.Directive({
            selector: '[layout]'
        }), 
        __metadata('design:paramtypes', [])
    ], LayoutDirective);
    return LayoutDirective;
}());
exports.LayoutDirective = LayoutDirective;
var FlexDirective = (function () {
    function FlexDirective() {
        this.shrink = 1;
        this.grow = 1;
    }
    Object.defineProperty(FlexDirective.prototype, "style", {
        get: function () {
            return this.grow + " " + this.shrink + " " + (this.flex === '' ? '0' : this.flex) + "%";
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Number)
    ], FlexDirective.prototype, "shrink", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Number)
    ], FlexDirective.prototype, "grow", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', String)
    ], FlexDirective.prototype, "flex", void 0);
    __decorate([
        core_2.HostBinding('style.flex'), 
        __metadata('design:type', Object)
    ], FlexDirective.prototype, "style", null);
    FlexDirective = __decorate([
        core_2.Directive({
            selector: '[flex]'
        }), 
        __metadata('design:paramtypes', [])
    ], FlexDirective);
    return FlexDirective;
}());
exports.FlexDirective = FlexDirective;
platform_browser_dynamic_1.bootstrap(angular_websockets_demo_component_1.AngularWebsocketsDemoAppComponent, [
    core_2.provide(core_2.PLATFORM_DIRECTIVES, { useValue: FlexDirective, multi: true }),
    core_2.provide(core_2.PLATFORM_DIRECTIVES, { useValue: LayoutDirective, multi: true }),
]);
//# sourceMappingURL=main.js.map