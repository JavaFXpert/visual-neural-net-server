import { ElementRef, Renderer, Type } from '@angular/core';
export declare class MdButton {
    private elementRef;
    private renderer;
    private _color;
    /** Whether the button has focus from the keyboard (not the mouse). Used for class binding. */
    isKeyboardFocused: boolean;
    /** Whether a mousedown has occurred on this element in the last 100ms. */
    isMouseDown: boolean;
    constructor(elementRef: ElementRef, renderer: Renderer);
    color: string;
    _updateColor(newColor: string): void;
    _setElementColor(color: string, isAdd: boolean): void;
    /** TODO(hansl): e2e test this function. */
    focus(): void;
}
export declare class MdAnchor extends MdButton {
    _disabled: boolean;
    constructor(elementRef: ElementRef, renderer: Renderer);
    tabIndex: number;
    isAriaDisabled: string;
    disabled: boolean;
}
export declare const MD_BUTTON_DIRECTIVES: Type[];
