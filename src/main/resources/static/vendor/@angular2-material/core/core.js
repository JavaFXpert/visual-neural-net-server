"use strict";
// RTL
var dir_1 = require('./rtl/dir');
exports.Dir = dir_1.Dir;
// Portals
var portal_1 = require('./portal/portal');
exports.Portal = portal_1.Portal;
exports.BasePortalHost = portal_1.BasePortalHost;
exports.ComponentPortal = portal_1.ComponentPortal;
exports.TemplatePortal = portal_1.TemplatePortal;
var portal_directives_1 = require('./portal/portal-directives');
exports.PortalHostDirective = portal_directives_1.PortalHostDirective;
exports.TemplatePortalDirective = portal_directives_1.TemplatePortalDirective;
exports.PORTAL_DIRECTIVES = portal_directives_1.PORTAL_DIRECTIVES;
var dom_portal_host_1 = require('./portal/dom-portal-host');
exports.DomPortalHost = dom_portal_host_1.DomPortalHost;
// Overlay
var overlay_1 = require('./overlay/overlay');
exports.Overlay = overlay_1.Overlay;
exports.OVERLAY_CONTAINER_TOKEN = overlay_1.OVERLAY_CONTAINER_TOKEN;
exports.OVERLAY_PROVIDERS = overlay_1.OVERLAY_PROVIDERS;
var overlay_ref_1 = require('./overlay/overlay-ref');
exports.OverlayRef = overlay_ref_1.OverlayRef;
var overlay_state_1 = require('./overlay/overlay-state');
exports.OverlayState = overlay_state_1.OverlayState;
var overlay_directives_1 = require('./overlay/overlay-directives');
exports.ConnectedOverlayDirective = overlay_directives_1.ConnectedOverlayDirective;
exports.OverlayOrigin = overlay_directives_1.OverlayOrigin;
exports.OVERLAY_DIRECTIVES = overlay_directives_1.OVERLAY_DIRECTIVES;
// Gestures
var MdGestureConfig_1 = require('./gestures/MdGestureConfig');
exports.MdGestureConfig = MdGestureConfig_1.MdGestureConfig;
// a11y
var live_announcer_1 = require('./a11y/live-announcer');
exports.MdLiveAnnouncer = live_announcer_1.MdLiveAnnouncer;
exports.LIVE_ANNOUNCER_ELEMENT_TOKEN = live_announcer_1.LIVE_ANNOUNCER_ELEMENT_TOKEN;
var unique_selection_dispatcher_1 = require('./coordination/unique-selection-dispatcher');
exports.MdUniqueSelectionDispatcher = unique_selection_dispatcher_1.MdUniqueSelectionDispatcher;
//# sourceMappingURL=core.js.map