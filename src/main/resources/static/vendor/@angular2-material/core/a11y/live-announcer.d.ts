import { OpaqueToken } from '@angular/core';
export declare const LIVE_ANNOUNCER_ELEMENT_TOKEN: OpaqueToken;
export declare type AriaLivePoliteness = 'off' | 'polite' | 'assertive';
export declare class MdLiveAnnouncer {
    private _liveElement;
    constructor(elementToken: any);
    /**
     * @param message Message to be announced to the screenreader
     * @param politeness The politeness of the announcer element.
     */
    announce(message: string, politeness?: AriaLivePoliteness): void;
    private _createLiveElement();
}
