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
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var field_value_1 = require('@angular2-material/core/annotations/field-value');
var Observable_1 = require('rxjs/Observable');
exports.MD_SLIDE_TOGGLE_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return MdSlideToggle; }),
    multi: true
};
// A simple change event emitted by the MdSlideToggle component.
var MdSlideToggleChange = (function () {
    function MdSlideToggleChange() {
    }
    return MdSlideToggleChange;
}());
exports.MdSlideToggleChange = MdSlideToggleChange;
// Increasing integer for generating unique ids for slide-toggle components.
var nextId = 0;
var MdSlideToggle = (function () {
    function MdSlideToggle(_elementRef, _renderer) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this.onChange = function (_) { };
        this.onTouched = function () { };
        // A unique id for the slide-toggle. By default the id is auto-generated.
        this._uniqueId = "md-slide-toggle-" + ++nextId;
        this._checked = false;
        this._hasFocus = false;
        this._isMousedown = false;
        this._isInitialized = false;
        this.disabled = false;
        this.name = null;
        this.id = this._uniqueId;
        this.tabIndex = 0;
        this.ariaLabel = null;
        this.ariaLabelledby = null;
        this._change = new core_1.EventEmitter();
        this.change = this._change.asObservable();
        // Returns the unique id for the visual hidden input.
        this.getInputId = function () { return ((_this.id || _this._uniqueId) + "-input"); };
    }
    /** TODO: internal */
    MdSlideToggle.prototype.ngAfterContentInit = function () {
        // Mark this component as initialized in AfterContentInit because the initial checked value can
        // possibly be set by NgModel or the checked attribute. This would cause the change event to
        // be emitted, before the component is actually initialized.
        this._isInitialized = true;
    };
    /**
     * The onChangeEvent method will be also called on click.
     * This is because everything for the slide-toggle is wrapped inside of a label,
     * which triggers a onChange event on click.
     * @internal
     */
    MdSlideToggle.prototype.onChangeEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the component's `change` output.
        event.stopPropagation();
        if (!this.disabled) {
            this.toggle();
        }
    };
    /** @internal */
    MdSlideToggle.prototype.onInputClick = function (event) {
        this.onTouched();
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /** @internal */
    MdSlideToggle.prototype.setMousedown = function () {
        var _this = this;
        // We only *show* the focus style when focus has come to the button via the keyboard.
        // The Material Design spec is silent on this topic, and without doing this, the
        // button continues to look :active after clicking.
        // @see http://marcysutton.com/button-focus-hell/
        this._isMousedown = true;
        setTimeout(function () { return _this._isMousedown = false; }, 100);
    };
    /** @internal */
    MdSlideToggle.prototype.onInputFocus = function () {
        // Only show the focus / ripple indicator when the focus was not triggered by a mouse
        // interaction on the component.
        if (!this._isMousedown) {
            this._hasFocus = true;
        }
    };
    /** @internal */
    MdSlideToggle.prototype.onInputBlur = function () {
        this._hasFocus = false;
        this.onTouched();
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdSlideToggle.prototype.writeValue = function (value) {
        this.checked = value;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdSlideToggle.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdSlideToggle.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    Object.defineProperty(MdSlideToggle.prototype, "checked", {
        get: function () {
            return !!this._checked;
        },
        set: function (value) {
            if (this.checked !== !!value) {
                this._checked = value;
                this.onChange(this._checked);
                // Only fire a change event if the `slide-toggle` is completely initialized and
                // all attributes / inputs are properly loaded.
                if (this._isInitialized) {
                    this._emitChangeEvent();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlideToggle.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    MdSlideToggle.prototype.toggle = function () {
        this.checked = !this.checked;
    };
    MdSlideToggle.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdSlideToggle.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    MdSlideToggle.prototype._emitChangeEvent = function () {
        var event = new MdSlideToggleChange();
        event.source = this;
        event.checked = this.checked;
        this._change.emit(event);
    };
    __decorate([
        core_1.Input(),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdSlideToggle.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MdSlideToggle.prototype, "tabIndex", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "ariaLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "ariaLabelledby", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Observable_1.Observable)
    ], MdSlideToggle.prototype, "change", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdSlideToggle.prototype, "checked", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "color", null);
    MdSlideToggle = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'md-slide-toggle',
            host: {
                '[class.md-checked]': 'checked',
                '[class.md-disabled]': 'disabled',
                // This md-slide-toggle prefix will change, once the temporary ripple is removed.
                '[class.md-slide-toggle-focused]': '_hasFocus',
                '(mousedown)': 'setMousedown()'
            },
            template: "<label class=\"md-slide-toggle-label\"> <div class=\"md-slide-toggle-container\"> <div class=\"md-slide-toggle-bar\"></div> <div class=\"md-slide-toggle-thumb-container\"> <div class=\"md-slide-toggle-thumb\"> <div class=\"md-ink-ripple\"></div> </div> </div> <input #input class=\"md-slide-toggle-checkbox\" type=\"checkbox\" [id]=\"getInputId()\" [tabIndex]=\"tabIndex\" [checked]=\"checked\" [disabled]=\"disabled\" [attr.name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (blur)=\"onInputBlur()\" (focus)=\"onInputFocus()\" (change)=\"onChangeEvent($event)\" (click)=\"onInputClick($event)\"> </div> <span class=\"md-slide-toggle-content\"> <ng-content></ng-content> </span> </label>",
            styles: ["/** * Mixin that creates a new stacking context. * see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context */ /** * This mixin hides an element visually. * That means it's still accessible for screen-readers but not visible in view. */ /** * Forces an element to grow to fit floated contents; used as as an alternative to * `overflow: hidden;` because it doesn't cut off contents. */ /** * A mixin, which generates temporary ink ripple on a given component. * When $bindToParent is set to true, it will check for the focused class on the same selector as you included * that mixin. * It is also possible to specify the color palette of the temporary ripple. By default it uses the * accent palette for its background. */ /** * A collection of mixins and CSS classes that can be used to apply elevation to a material * element. * See: https://www.google.com/design/spec/what-is-material/elevation-shadows.html * Examples: * * * .md-foo { *   @include $md-elevation(2); * *   &:active { *     @include $md-elevation(8); *   } * } * * <div id=\"external-card\" class=\"md-elevation-z2\"><p>Some content</p></div> * * For an explanation of the design behind how elevation is implemented, see the design doc at * https://goo.gl/Kq0k9Z. */ /** * The css property used for elevation. In most cases this should not be changed. It is exposed * as a variable for abstraction / easy use when needing to reference the property directly, for * example in a will-change rule. */ /** The default duration value for elevation transitions. */ /** The default easing value for elevation transitions. */ /** * Applies the correct css rules to an element to give it the elevation specified by $zValue. * The $zValue must be between 0 and 24. */ /** * Returns a string that can be used as the value for a transition property for elevation. * Calling this function directly is useful in situations where a component needs to transition * more than one property. * * .foo { *   transition: md-elevation-transition-property-value(), opacity 100ms ease; *   will-change: $md-elevation-property, opacity; * } */ /** * Applies the correct css rules needed to have an element transition between elevations. * This mixin should be applied to elements whose elevation values will change depending on their * context (e.g. when active or disabled). */ :host { display: -webkit-box; display: -ms-flexbox; display: flex; height: 24px; margin: 16px 0; line-height: 24px; white-space: nowrap; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; outline: none; } :host.md-checked .md-slide-toggle-thumb-container { -webkit-transform: translate3d(100%, 0, 0); transform: translate3d(100%, 0, 0); } :host.md-checked .md-slide-toggle-thumb { background-color: #9c27b0; } :host.md-checked .md-slide-toggle-bar { background-color: rgba(156, 39, 176, 0.5); } :host .md-ink-ripple { border-radius: 50%; opacity: 0; height: 48px; left: 50%; overflow: hidden; pointer-events: none; position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-transition: opacity ease 280ms, background-color ease 280ms; transition: opacity ease 280ms, background-color ease 280ms; width: 48px; } :host.md-slide-toggle-focused .md-ink-ripple { opacity: 1; background-color: rgba(156, 39, 176, 0.26); } :host.md-slide-toggle-disabled .md-ink-ripple { background-color: #000; } :host.md-slide-toggle-focused:not(.md-checked) .md-ink-ripple { background-color: rgba(0, 0, 0, 0.12); } :host.md-primary.md-checked .md-slide-toggle-thumb { background-color: #009688; } :host.md-primary.md-checked .md-slide-toggle-bar { background-color: rgba(0, 150, 136, 0.5); } :host.md-primary .md-ink-ripple { border-radius: 50%; opacity: 0; height: 48px; left: 50%; overflow: hidden; pointer-events: none; position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-transition: opacity ease 280ms, background-color ease 280ms; transition: opacity ease 280ms, background-color ease 280ms; width: 48px; } :host.md-primary.md-slide-toggle-focused .md-ink-ripple { opacity: 1; background-color: rgba(0, 150, 136, 0.26); } :host.md-primary.md-slide-toggle-disabled .md-ink-ripple { background-color: #000; } :host.md-primary.md-slide-toggle-focused:not(.md-checked) .md-ink-ripple { background-color: rgba(0, 0, 0, 0.12); } :host.md-warn.md-checked .md-slide-toggle-thumb { background-color: #f44336; } :host.md-warn.md-checked .md-slide-toggle-bar { background-color: rgba(244, 67, 54, 0.5); } :host.md-warn .md-ink-ripple { border-radius: 50%; opacity: 0; height: 48px; left: 50%; overflow: hidden; pointer-events: none; position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-transition: opacity ease 280ms, background-color ease 280ms; transition: opacity ease 280ms, background-color ease 280ms; width: 48px; } :host.md-warn.md-slide-toggle-focused .md-ink-ripple { opacity: 1; background-color: rgba(244, 67, 54, 0.26); } :host.md-warn.md-slide-toggle-disabled .md-ink-ripple { background-color: #000; } :host.md-warn.md-slide-toggle-focused:not(.md-checked) .md-ink-ripple { background-color: rgba(0, 0, 0, 0.12); } :host.md-disabled .md-slide-toggle-label, :host.md-disabled .md-slide-toggle-container { cursor: default; } :host.md-disabled .md-slide-toggle-thumb { background-color: #bdbdbd; } :host.md-disabled .md-slide-toggle-bar { background-color: rgba(0, 0, 0, 0.12); } .md-slide-toggle-content { font-size: 14px; font-family: Roboto, \"Helvetica Neue\", sans-serif; font-weight: 500; } .md-slide-toggle-label { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-flex: 1; -ms-flex: 1; flex: 1; cursor: pointer; } .md-slide-toggle-container { cursor: -webkit-grab; cursor: grab; width: 36px; height: 24px; position: relative; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; margin-right: 8px; } .md-slide-toggle-thumb-container { position: absolute; top: 2px; left: 0; z-index: 1; width: 16px; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); -webkit-transition: all 80ms linear; transition: all 80ms linear; -webkit-transition-property: -webkit-transform; transition-property: -webkit-transform; transition-property: transform; transition-property: transform, -webkit-transform; } .md-slide-toggle-thumb { position: absolute; margin: 0; left: 0; top: 0; height: 20px; width: 20px; border-radius: 50%; background-color: #fafafa; box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); } .md-slide-toggle-bar { position: absolute; left: 1px; top: 5px; width: 34px; height: 14px; background-color: #9e9e9e; border-radius: 8px; } .md-slide-toggle-checkbox { border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; text-transform: none; width: 1px; } .md-slide-toggle-bar, .md-slide-toggle-thumb { -webkit-transition: all 80ms linear; transition: all 80ms linear; -webkit-transition-property: background-color; transition-property: background-color; -webkit-transition-delay: 50ms; transition-delay: 50ms; } "],
            providers: [exports.MD_SLIDE_TOGGLE_VALUE_ACCESSOR],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], MdSlideToggle);
    return MdSlideToggle;
}());
exports.MdSlideToggle = MdSlideToggle;
exports.MD_SLIDE_TOGGLE_DIRECTIVES = [MdSlideToggle];
//# sourceMappingURL=slide-toggle.js.map