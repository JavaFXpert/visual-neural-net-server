import { PortalHost, Portal } from '../portal/portal';
import { OverlayState } from './overlay-state';
/**
 * Reference to an overlay that has been created with the Overlay service.
 * Used to manipulate or dispose of said overlay.
 */
export declare class OverlayRef implements PortalHost {
    private _portalHost;
    private _pane;
    private _state;
    constructor(_portalHost: PortalHost, _pane: HTMLElement, _state: OverlayState);
    attach(portal: Portal<any>): Promise<any>;
    detach(): Promise<any>;
    dispose(): void;
    hasAttached(): boolean;
    /** Gets the current state config of the overlay. */
    getState(): OverlayState;
    /** Updates the position of the overlay based on the position strategy. */
    private _updatePosition();
}
