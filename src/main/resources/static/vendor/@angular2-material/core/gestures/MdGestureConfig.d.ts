import { HammerGestureConfig } from '@angular/platform-browser';
export declare class MdGestureConfig extends HammerGestureConfig {
    events: string[];
    buildHammer(element: HTMLElement): HammerManager;
}
