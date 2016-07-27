import { ComponentResolver, ComponentRef } from '@angular/core';
import { BasePortalHost, ComponentPortal, TemplatePortal } from './portal';
/**
 * A PortalHost for attaching portals to an arbitrary DOM element outside of the Angular
 * application context.
 *
 * This is the only part of the portal core that directly touches the DOM.
 */
export declare class DomPortalHost extends BasePortalHost {
    private _hostDomElement;
    private _componentResolver;
    constructor(_hostDomElement: Element, _componentResolver: ComponentResolver);
    /** Attach the given ComponentPortal to DOM element using the ComponentResolver. */
    attachComponentPortal(portal: ComponentPortal): Promise<ComponentRef<any>>;
    attachTemplatePortal(portal: TemplatePortal): Promise<Map<string, any>>;
    dispose(): void;
}
