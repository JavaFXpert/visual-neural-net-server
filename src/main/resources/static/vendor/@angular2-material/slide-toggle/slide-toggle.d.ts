import { ElementRef, Renderer, AfterContentInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
export declare const MD_SLIDE_TOGGLE_VALUE_ACCESSOR: any;
export declare class MdSlideToggleChange {
    source: MdSlideToggle;
    checked: boolean;
}
export declare class MdSlideToggle implements AfterContentInit, ControlValueAccessor {
    private _elementRef;
    private _renderer;
    private onChange;
    private onTouched;
    private _uniqueId;
    private _checked;
    private _color;
    private _hasFocus;
    private _isMousedown;
    private _isInitialized;
    disabled: boolean;
    name: string;
    id: string;
    tabIndex: number;
    ariaLabel: string;
    ariaLabelledby: string;
    private _change;
    change: Observable<MdSlideToggleChange>;
    getInputId: () => string;
    constructor(_elementRef: ElementRef, _renderer: Renderer);
    /** TODO: internal */
    ngAfterContentInit(): void;
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    writeValue(value: any): void;
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    registerOnChange(fn: any): void;
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    registerOnTouched(fn: any): void;
    checked: boolean;
    color: string;
    toggle(): void;
    private _updateColor(newColor);
    private _setElementColor(color, isAdd);
    private _emitChangeEvent();
}
export declare const MD_SLIDE_TOGGLE_DIRECTIVES: typeof MdSlideToggle[];
