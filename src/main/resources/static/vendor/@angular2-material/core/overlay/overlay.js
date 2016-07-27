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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var overlay_state_1 = require('./overlay-state');
var dom_portal_host_1 = require('../portal/dom-portal-host');
var overlay_ref_1 = require('./overlay-ref');
var overlay_position_builder_1 = require('./position/overlay-position-builder');
var viewport_ruler_1 = require('./position/viewport-ruler');
/** Token used to inject the DOM element that serves as the overlay container. */
exports.OVERLAY_CONTAINER_TOKEN = new core_1.OpaqueToken('overlayContainer');
/** Next overlay unique ID. */
var nextUniqueId = 0;
/** The default state for newly created overlays. */
var defaultState = new overlay_state_1.OverlayState();
/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalHost, so any kind of Portal can be loaded into one.
 */
var Overlay = (function () {
    function Overlay(overlayContainerElement, _componentResolver, _positionBuilder) {
        this._componentResolver = _componentResolver;
        this._positionBuilder = _positionBuilder;
        // We inject the container as `any` because the constructor signature cannot reference
        // browser globals (HTMLElement) on non-browser environments, since having a class decorator
        // causes TypeScript to preserve the constructor signature types.
        this._overlayContainerElement = overlayContainerElement;
    }
    /**
     * Creates an overlay.
     * @param state State to apply to the overlay.
     * @returns A reference to the created overlay.
     */
    Overlay.prototype.create = function (state) {
        var _this = this;
        if (state === void 0) { state = defaultState; }
        return this._createPaneElement().then(function (pane) { return _this._createOverlayRef(pane, state); });
    };
    /**
     * Returns a position builder that can be used, via fluent API,
     * to construct and configure a position strategy.
     */
    Overlay.prototype.position = function () {
        return this._positionBuilder;
    };
    /**
     * Creates the DOM element for an overlay and appends it to the overlay container.
     * @returns Promise resolving to the created element.
     */
    Overlay.prototype._createPaneElement = function () {
        var pane = document.createElement('div');
        pane.id = "md-overlay-" + nextUniqueId++;
        pane.classList.add('md-overlay-pane');
        this._overlayContainerElement.appendChild(pane);
        return Promise.resolve(pane);
    };
    /**
     * Create a DomPortalHost into which the overlay content can be loaded.
     * @param pane The DOM element to turn into a portal host.
     * @returns A portal host for the given DOM element.
     */
    Overlay.prototype._createPortalHost = function (pane) {
        return new dom_portal_host_1.DomPortalHost(pane, this._componentResolver);
    };
    /**
     * Creates an OverlayRef for an overlay in the given DOM element.
     * @param pane DOM element for the overlay
     * @param state
     * @returns {OverlayRef}
     */
    Overlay.prototype._createOverlayRef = function (pane, state) {
        return new overlay_ref_1.OverlayRef(this._createPortalHost(pane), pane, state);
    };
    Overlay = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(exports.OVERLAY_CONTAINER_TOKEN)), 
        __metadata('design:paramtypes', [Object, core_1.ComponentResolver, overlay_position_builder_1.OverlayPositionBuilder])
    ], Overlay);
    return Overlay;
}());
exports.Overlay = Overlay;
/** Providers for Overlay and its related injectables. */
exports.OVERLAY_PROVIDERS = [
    viewport_ruler_1.ViewportRuler,
    overlay_position_builder_1.OverlayPositionBuilder,
    Overlay,
];
//# sourceMappingURL=overlay.js.map