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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var unique_selection_dispatcher_1 = require('@angular2-material/core/coordination/unique-selection-dispatcher');
// Re-exports.
var unique_selection_dispatcher_2 = require('@angular2-material/core/coordination/unique-selection-dispatcher');
exports.MdUniqueSelectionDispatcher = unique_selection_dispatcher_2.MdUniqueSelectionDispatcher;
/**
 * Provider Expression that allows md-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 */
exports.MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = new core_1.Provider(forms_1.NG_VALUE_ACCESSOR, {
    useExisting: core_1.forwardRef(function () { return MdRadioGroup; }),
    multi: true
});
// TODO(mtlin):
// Ink ripple is currently placeholder.
// Determine motion spec for button transitions.
// Design review.
// RTL
// Support forms API.
// Use ChangeDetectionStrategy.OnPush
var _uniqueIdCounter = 0;
/** A simple change event emitted by either MdRadioButton or MdRadioGroup. */
var MdRadioChange = (function () {
    function MdRadioChange() {
    }
    return MdRadioChange;
}());
exports.MdRadioChange = MdRadioChange;
var MdRadioGroup = (function () {
    function MdRadioGroup() {
        /**
         * Selected value for group. Should equal the value of the selected radio button if there *is*
         * a corresponding radio button with a matching value. If there is *not* such a corresponding
         * radio button, this value persists to be applied in case a new radio button is added with a
         * matching value.
         */
        this._value = null;
        /** The HTML name attribute applied to radio buttons in this group. */
        this._name = "md-radio-group-" + _uniqueIdCounter++;
        /** Disables all individual radio buttons assigned to this group. */
        this._disabled = false;
        /** The currently selected radio button. Should match value. */
        this._selected = null;
        /** Whether the `value` has been set to its initial value. */
        this._isInitialized = false;
        /** The method to be called in order to update ngModel */
        this._controlValueAccessorChangeFn = function (value) { };
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this.onTouched = function () { };
        /** Event emitted when the group value changes. */
        this.change = new core_1.EventEmitter();
        /** Child radio buttons. */
        this._radios = null;
    }
    Object.defineProperty(MdRadioGroup.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
            this._updateRadioButtonNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            // The presence of *any* disabled value makes the component disabled, *except* for false.
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            if (this._value != newValue) {
                // Set this before proceeding to ensure no circular loop occurs with selection.
                this._value = newValue;
                this._updateSelectedRadioFromValue();
                // Only fire a change event if this isn't the first time the value is ever set.
                if (this._isInitialized) {
                    this._emitChangeEvent();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            if (selected && !selected.checked) {
                selected.checked = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize properties once content children are available.
     * This allows us to propagate relevant attributes to associated buttons.
     * TODO: internal
     */
    MdRadioGroup.prototype.ngAfterContentInit = function () {
        // Mark this component as initialized in AfterContentInit because the initial value can
        // possibly be set by NgModel on MdRadioGroup, and it is possible that the OnInit of the
        // NgModel occurs *after* the OnInit of the MdRadioGroup.
        this._isInitialized = true;
    };
    /**
     * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
     * radio buttons upon their blur.
     * @internal
     */
    MdRadioGroup.prototype.touch = function () {
        if (this.onTouched) {
            this.onTouched();
        }
    };
    MdRadioGroup.prototype._updateRadioButtonNames = function () {
        var _this = this;
        (this._radios || []).forEach(function (radio) {
            radio.name = _this.name;
        });
    };
    /** Updates the `selected` radio button from the internal _value state. */
    MdRadioGroup.prototype._updateSelectedRadioFromValue = function () {
        var _this = this;
        // If the value already matches the selected radio, do nothing.
        var isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._radios != null && !isAlreadySelected) {
            var matchingRadio = this._radios.filter(function (radio) { return radio.value == _this._value; })[0];
            if (matchingRadio) {
                this.selected = matchingRadio;
            }
            else if (this.value == null) {
                this.selected = null;
                this._radios.forEach(function (radio) { radio.checked = false; });
            }
        }
    };
    /** Dispatch change event with current selection and group value. */
    MdRadioGroup.prototype._emitChangeEvent = function () {
        var event = new MdRadioChange();
        event.source = this._selected;
        event.value = this._value;
        this._controlValueAccessorChangeFn(event.value);
        this.change.emit(event);
    };
    /**
      * Implemented as part of ControlValueAccessor.
      * TODO: internal
      */
    MdRadioGroup.prototype.writeValue = function (value) {
        this.value = value;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdRadioGroup.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdRadioGroup.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], MdRadioGroup.prototype, "change", void 0);
    __decorate([
        core_1.ContentChildren(core_1.forwardRef(function () { return MdRadioButton; })), 
        __metadata('design:type', core_1.QueryList)
    ], MdRadioGroup.prototype, "_radios", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdRadioGroup.prototype, "name", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdRadioGroup.prototype, "align", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MdRadioGroup.prototype, "disabled", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdRadioGroup.prototype, "value", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdRadioGroup.prototype, "selected", null);
    MdRadioGroup = __decorate([
        core_1.Directive({
            selector: 'md-radio-group',
            providers: [exports.MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
            host: {
                'role': 'radiogroup',
            },
        }), 
        __metadata('design:paramtypes', [])
    ], MdRadioGroup);
    return MdRadioGroup;
}());
exports.MdRadioGroup = MdRadioGroup;
var MdRadioButton = (function () {
    function MdRadioButton(radioGroup, radioDispatcher) {
        // Assertions. Ideally these should be stripped out by the compiler.
        // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
        var _this = this;
        this.radioDispatcher = radioDispatcher;
        /** Whether this radio is checked. */
        this._checked = false;
        /** The unique ID for the radio button. */
        this.id = "md-radio-" + _uniqueIdCounter++;
        /** Value assigned to this radio.*/
        this._value = null;
        /** Event emitted when the group value changes. */
        this.change = new core_1.EventEmitter();
        this.radioGroup = radioGroup;
        radioDispatcher.listen(function (id, name) {
            if (id != _this.id && name == _this.name) {
                _this.checked = false;
            }
        });
    }
    Object.defineProperty(MdRadioButton.prototype, "inputId", {
        get: function () {
            return this.id + "-input";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "checked", {
        get: function () {
            return this._checked;
        },
        set: function (newCheckedState) {
            if (newCheckedState) {
                // Notify all radio buttons with the same name to un-check.
                this.radioDispatcher.notify(this.id, this.name);
            }
            if (newCheckedState != this._checked) {
                this._emitChangeEvent();
            }
            this._checked = newCheckedState;
            if (newCheckedState && this.radioGroup && this.radioGroup.value != this.value) {
                this.radioGroup.selected = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "value", {
        /** MdRadioGroup reads this to assign its own value. */
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (this._value != value) {
                if (this.radioGroup != null && this.checked) {
                    this.radioGroup.value = value;
                }
                this._value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "align", {
        get: function () {
            return this._align || (this.radioGroup != null && this.radioGroup.align) || 'start';
        },
        set: function (value) {
            this._align = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "disabled", {
        get: function () {
            return this._disabled || (this.radioGroup != null && this.radioGroup.disabled);
        },
        set: function (value) {
            // The presence of *any* disabled value makes the component disabled, *except* for false.
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    /** TODO: internal */
    MdRadioButton.prototype.ngOnInit = function () {
        if (this.radioGroup) {
            // If the radio is inside a radio group, determine if it should be checked
            this.checked = this.radioGroup.value === this._value;
            // Copy name from parent radio group
            this.name = this.radioGroup.name;
        }
    };
    /** Dispatch change event with current value. */
    MdRadioButton.prototype._emitChangeEvent = function () {
        var event = new MdRadioChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    };
    /** @internal */
    MdRadioButton.prototype.onClick = function (event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (this.radioGroup != null) {
            // Propagate the change one-way via the group, which will in turn mark this
            // button as checked.
            this.radioGroup.selected = this;
            this.radioGroup.touch();
        }
        else {
            this.checked = true;
        }
    };
    /**
     * We use a hidden native input field to handle changes to focus state via keyboard navigation,
     * with visual rendering done separately. The native element is kept in sync with the overall
     * state of the component.
     * @internal
     */
    MdRadioButton.prototype.onInputFocus = function () {
        this._isFocused = true;
    };
    /** @internal */
    MdRadioButton.prototype.onInputBlur = function () {
        this._isFocused = false;
        if (this.radioGroup) {
            this.radioGroup.touch();
        }
    };
    /**
     * Checks the radio due to an interaction with the underlying native <input type="radio">
     * @internal
     */
    MdRadioButton.prototype.onInputChange = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
        this.checked = true;
        if (this.radioGroup) {
            this.radioGroup.touch();
        }
    };
    __decorate([
        core_1.HostBinding('class.md-radio-focused'), 
        __metadata('design:type', Boolean)
    ], MdRadioButton.prototype, "_isFocused", void 0);
    __decorate([
        core_1.HostBinding('id'),
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdRadioButton.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdRadioButton.prototype, "name", void 0);
    __decorate([
        core_1.Input('aria-label'), 
        __metadata('design:type', String)
    ], MdRadioButton.prototype, "ariaLabel", void 0);
    __decorate([
        core_1.Input('aria-labelledby'), 
        __metadata('design:type', String)
    ], MdRadioButton.prototype, "ariaLabelledby", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], MdRadioButton.prototype, "change", void 0);
    __decorate([
        core_1.HostBinding('class.md-radio-checked'),
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MdRadioButton.prototype, "checked", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdRadioButton.prototype, "value", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdRadioButton.prototype, "align", null);
    __decorate([
        core_1.HostBinding('class.md-radio-disabled'),
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MdRadioButton.prototype, "disabled", null);
    MdRadioButton = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'md-radio-button',
            template: "<!-- TODO(jelbourn): render the radio on either side of the content --> <!-- TODO(mtlin): Evaluate trade-offs of using native radio vs. cost of additional bindings. --> <label [attr.for]=\"inputId\" class=\"md-radio-label\"> <!-- The actual 'radio' part of the control. --> <div class=\"md-radio-container\"> <div class=\"md-radio-outer-circle\"></div> <div class=\"md-radio-inner-circle\"></div> <div class=\"md-ink-ripple\"></div> </div> <input #input class=\"md-radio-input\" type=\"radio\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled\" [name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"onInputChange($event)\" (focus)=\"onInputFocus()\" (blur)=\"onInputBlur()\" /> <!-- The label content for radio control. --> <div class=\"md-radio-label-content\" [class.md-radio-align-end]=\"align == 'end'\"> <ng-content></ng-content> </div> </label> ",
            styles: ["/** * Mixin that creates a new stacking context. * see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context */ /** * This mixin hides an element visually. * That means it's still accessible for screen-readers but not visible in view. */ /** * Forces an element to grow to fit floated contents; used as as an alternative to * `overflow: hidden;` because it doesn't cut off contents. */ /** * A mixin, which generates temporary ink ripple on a given component. * When $bindToParent is set to true, it will check for the focused class on the same selector as you included * that mixin. * It is also possible to specify the color palette of the temporary ripple. By default it uses the * accent palette for its background. */ md-radio-button { display: inline-block; } .md-radio-label { cursor: pointer; display: -webkit-inline-box; display: -ms-inline-flexbox; display: inline-flex; -webkit-box-align: baseline; -ms-flex-align: baseline; align-items: baseline; white-space: nowrap; } .md-radio-container { box-sizing: border-box; display: inline-block; height: 20px; position: relative; width: 20px; top: 2px; } .md-radio-outer-circle { border-color: rgba(0, 0, 0, 0.54); border: solid 2px; border-radius: 50%; box-sizing: border-box; height: 20px; left: 0; position: absolute; top: 0; -webkit-transition: border-color ease 280ms; transition: border-color ease 280ms; width: 20px; } .md-radio-checked .md-radio-outer-circle { border-color: #9c27b0; } .md-radio-disabled .md-radio-outer-circle { border-color: rgba(0, 0, 0, 0.38); } .md-radio-inner-circle { background-color: #9c27b0; border-radius: 50%; box-sizing: border-box; height: 20px; left: 0; position: absolute; top: 0; -webkit-transition: background-color ease 280ms, -webkit-transform ease 280ms; transition: background-color ease 280ms, -webkit-transform ease 280ms; transition: transform ease 280ms, background-color ease 280ms; transition: transform ease 280ms, background-color ease 280ms, -webkit-transform ease 280ms; -webkit-transform: scale(0); transform: scale(0); width: 20px; } .md-radio-checked .md-radio-inner-circle { -webkit-transform: scale(0.5); transform: scale(0.5); } .md-radio-disabled .md-radio-inner-circle { background-color: rgba(0, 0, 0, 0.38); } .md-radio-label-content { display: inline-block; -webkit-box-ordinal-group: 1; -ms-flex-order: 0; order: 0; line-height: inherit; padding-left: 8px; padding-right: 0; } [dir='rtl'] .md-radio-label-content { padding-right: 8px; padding-left: 0; } .md-radio-label-content.md-radio-align-end { -webkit-box-ordinal-group: 0; -ms-flex-order: -1; order: -1; padding-left: 0; padding-right: 8px; } [dir='rtl'] .md-radio-label-content.md-radio-align-end { padding-right: 0; padding-left: 8px; } .md-radio-input { border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; text-transform: none; width: 1px; } .md-radio-disabled, .md-radio-disabled .md-radio-label { cursor: default; } .md-ink-ripple { border-radius: 50%; opacity: 0; height: 48px; left: 50%; overflow: hidden; pointer-events: none; position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-transition: opacity ease 280ms, background-color ease 280ms; transition: opacity ease 280ms, background-color ease 280ms; width: 48px; } .md-radio-focused .md-ink-ripple { opacity: 1; background-color: rgba(156, 39, 176, 0.26); } .md-radio-disabled .md-ink-ripple { background-color: #000; } "],
            encapsulation: core_1.ViewEncapsulation.None,
            host: {
                '(click)': 'onClick($event)'
            }
        }),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [MdRadioGroup, unique_selection_dispatcher_1.MdUniqueSelectionDispatcher])
    ], MdRadioButton);
    return MdRadioButton;
}());
exports.MdRadioButton = MdRadioButton;
exports.MD_RADIO_DIRECTIVES = [MdRadioGroup, MdRadioButton];
//# sourceMappingURL=radio.js.map