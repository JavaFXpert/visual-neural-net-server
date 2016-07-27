"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var portal_1 = require('./portal');
var portal_errors_1 = require('./portal-errors');
/**
 * A PortalHost for attaching portals to an arbitrary DOM element outside of the Angular
 * application context.
 *
 * This is the only part of the portal core that directly touches the DOM.
 */
var DomPortalHost = (function (_super) {
    __extends(DomPortalHost, _super);
    function DomPortalHost(_hostDomElement, _componentResolver) {
        _super.call(this);
        this._hostDomElement = _hostDomElement;
        this._componentResolver = _componentResolver;
    }
    /** Attach the given ComponentPortal to DOM element using the ComponentResolver. */
    DomPortalHost.prototype.attachComponentPortal = function (portal) {
        var _this = this;
        if (portal.viewContainerRef == null) {
            throw new portal_errors_1.MdComponentPortalAttachedToDomWithoutOriginError();
        }
        return this._componentResolver.resolveComponent(portal.component).then(function (componentFactory) {
            var ref = portal.viewContainerRef.createComponent(componentFactory, portal.viewContainerRef.length, portal.viewContainerRef.parentInjector);
            var hostView = ref.hostView;
            _this._hostDomElement.appendChild(hostView.rootNodes[0]);
            _this.setDisposeFn(function () { return ref.destroy(); });
            return ref;
        });
    };
    DomPortalHost.prototype.attachTemplatePortal = function (portal) {
        var _this = this;
        var viewContainer = portal.viewContainerRef;
        var viewRef = viewContainer.createEmbeddedView(portal.templateRef);
        viewRef.rootNodes.forEach(function (rootNode) { return _this._hostDomElement.appendChild(rootNode); });
        this.setDisposeFn((function () {
            var index = viewContainer.indexOf(viewRef);
            if (index != -1) {
                viewContainer.remove(index);
            }
        }));
        // TODO(jelbourn): Return locals from view.
        return Promise.resolve(new Map());
    };
    DomPortalHost.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._hostDomElement.parentNode != null) {
            this._hostDomElement.parentNode.removeChild(this._hostDomElement);
        }
    };
    return DomPortalHost;
}(portal_1.BasePortalHost));
exports.DomPortalHost = DomPortalHost;
//# sourceMappingURL=dom-portal-host.js.map