import { TemplateRef, Type, ViewContainerRef, ElementRef, ComponentRef } from '@angular/core';
/**
 * A `Portal` is something that you want to render somewhere else.
 * It can be attach to / detached from a `PortalHost`.
 */
export declare abstract class Portal<T> {
    private _attachedHost;
    /** Attach this portal to a host. */
    attach(host: PortalHost): Promise<T>;
    /** Detach this portal from its host */
    detach(): Promise<void>;
    /** Whether this portal is attached to a host. */
    isAttached: boolean;
    /**
     * Sets the PortalHost reference without performing `attach()`. This is used directly by
     * the PortalHost when it is performing an `attach()` or `detatch()`.
     */
    setAttachedHost(host: PortalHost): void;
}
/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
export declare class ComponentPortal extends Portal<ComponentRef<any>> {
    /** The type of the component that will be instantiated for attachment. */
    component: Type;
    /**
     * [Optional] Where the attached component should live in Angular's *logical* component tree.
     * This is different from where the component *renders*, which is determined by the PortalHost.
     * The origin necessary when the host is outside of the Angular application context.
     */
    viewContainerRef: ViewContainerRef;
    constructor(component: Type, viewContainerRef?: ViewContainerRef);
}
/**
 * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
 */
export declare class TemplatePortal extends Portal<Map<string, any>> {
    /** The embedded template that will be used to instantiate an embedded View in the host. */
    templateRef: TemplateRef<any>;
    /** Reference to the ViewContainer into which the template will be stamped out. */
    viewContainerRef: ViewContainerRef;
    /**
     * Additional locals for the instantiated embedded view.
     * These locals can be seen as "exports" for the template, such as how ngFor has
     * index / event / odd.
     * See https://angular.io/docs/ts/latest/api/core/EmbeddedViewRef-class.html
     */
    locals: Map<string, any>;
    constructor(template: TemplateRef<any>, viewContainerRef: ViewContainerRef);
    origin: ElementRef;
    attach(host: PortalHost, locals?: Map<string, any>): Promise<Map<string, any>>;
    detach(): Promise<void>;
}
/**
 * A `PortalHost` is an space that can contain a single `Portal`.
 */
export interface PortalHost {
    attach(portal: Portal<any>): Promise<any>;
    detach(): Promise<any>;
    dispose(): void;
    hasAttached(): boolean;
}
/**
 * Partial implementation of PortalHost that only deals with attaching either a
 * ComponentPortal or a TemplatePortal.
 */
export declare abstract class BasePortalHost implements PortalHost {
    /** The portal currently attached to the host. */
    private _attachedPortal;
    /** A function that will permanently dispose this host. */
    private _disposeFn;
    /** Whether this host has already been permanently disposed. */
    private _isDisposed;
    /** Whether this host has an attached portal. */
    hasAttached(): boolean;
    attach(portal: Portal<any>): Promise<any>;
    abstract attachComponentPortal(portal: ComponentPortal): Promise<ComponentRef<any>>;
    abstract attachTemplatePortal(portal: TemplatePortal): Promise<Map<string, any>>;
    detach(): Promise<void>;
    dispose(): void;
    setDisposeFn(fn: () => void): void;
}
