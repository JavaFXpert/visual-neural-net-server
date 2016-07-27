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
var testing_1 = require('@angular/core/testing');
var forms_1 = require('@angular/forms');
var testing_2 = require('@angular/compiler/testing');
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var radio_1 = require('./radio');
var unique_selection_dispatcher_1 = require('@angular2-material/core/coordination/unique-selection-dispatcher');
testing_1.describe('MdRadio', function () {
    var builder;
    var dispatcher;
    testing_1.beforeEachProviders(function () { return [
        forms_1.disableDeprecatedForms(),
        forms_1.provideForms(),
        core_1.provide(unique_selection_dispatcher_1.MdUniqueSelectionDispatcher, { useFactory: function () {
                dispatcher = new unique_selection_dispatcher_1.MdUniqueSelectionDispatcher();
                return dispatcher;
            } })
    ]; });
    testing_1.beforeEach(testing_1.inject([testing_2.TestComponentBuilder], function (tcb) {
        builder = tcb;
    }));
    testing_1.describe('inside of a group', function () {
        var fixture;
        var groupDebugElement;
        var groupNativeElement;
        var radioDebugElements;
        var radioNativeElements;
        var groupInstance;
        var radioInstances;
        var testComponent;
        testing_1.beforeEach(testing_1.async(function () {
            builder.createAsync(RadiosInsideRadioGroup).then(function (f) {
                fixture = f;
                fixture.detectChanges();
                testComponent = fixture.debugElement.componentInstance;
                groupDebugElement = fixture.debugElement.query(platform_browser_1.By.directive(radio_1.MdRadioGroup));
                groupNativeElement = groupDebugElement.nativeElement;
                groupInstance = groupDebugElement.injector.get(radio_1.MdRadioGroup);
                radioDebugElements = fixture.debugElement.queryAll(platform_browser_1.By.directive(radio_1.MdRadioButton));
                radioNativeElements = radioDebugElements.map(function (debugEl) { return debugEl.nativeElement; });
                radioInstances = radioDebugElements.map(function (debugEl) { return debugEl.componentInstance; });
            });
        }));
        testing_1.it('should set individual radio names based on the group name', function () {
            expect(groupInstance.name).toBeTruthy();
            for (var _i = 0, radioInstances_1 = radioInstances; _i < radioInstances_1.length; _i++) {
                var radio = radioInstances_1[_i];
                expect(radio.name).toBe(groupInstance.name);
            }
        });
        testing_1.it('should disable click interaction when the group is disabled', function () {
            testComponent.isGroupDisabled = true;
            fixture.detectChanges();
            radioNativeElements[0].click();
            expect(radioInstances[0].checked).toBe(false);
        });
        testing_1.it('should set alignment based on the group alignment', function () {
            testComponent.alignment = 'end';
            fixture.detectChanges();
            for (var _i = 0, radioInstances_2 = radioInstances; _i < radioInstances_2.length; _i++) {
                var radio = radioInstances_2[_i];
                expect(radio.align).toBe('end');
            }
            testComponent.alignment = 'start';
            fixture.detectChanges();
            for (var _a = 0, radioInstances_3 = radioInstances; _a < radioInstances_3.length; _a++) {
                var radio = radioInstances_3[_a];
                expect(radio.align).toBe('start');
            }
        });
        testing_1.it('should disable each individual radio when the group is disabled', function () {
            testComponent.isGroupDisabled = true;
            fixture.detectChanges();
            for (var _i = 0, radioInstances_4 = radioInstances; _i < radioInstances_4.length; _i++) {
                var radio = radioInstances_4[_i];
                expect(radio.disabled).toBe(true);
            }
        });
        testing_1.it('should update the group value when one of the radios changes', function () {
            expect(groupInstance.value).toBeFalsy();
            radioInstances[0].checked = true;
            fixture.detectChanges();
            expect(groupInstance.value).toBe('fire');
            expect(groupInstance.selected).toBe(radioInstances[0]);
        });
        testing_1.it('should update the group and radios when one of the radios is clicked', function () {
            expect(groupInstance.value).toBeFalsy();
            radioNativeElements[0].click();
            fixture.detectChanges();
            expect(groupInstance.value).toBe('fire');
            expect(groupInstance.selected).toBe(radioInstances[0]);
            expect(radioInstances[0].checked).toBe(true);
            expect(radioInstances[1].checked).toBe(false);
            radioNativeElements[1].click();
            fixture.detectChanges();
            expect(groupInstance.value).toBe('water');
            expect(groupInstance.selected).toBe(radioInstances[1]);
            expect(radioInstances[0].checked).toBe(false);
            expect(radioInstances[1].checked).toBe(true);
        });
        testing_1.it('should check a radio upon interaction with the underlying native radio button', function () {
            var nativeRadioInput = radioNativeElements[0].querySelector('input');
            nativeRadioInput.click();
            fixture.detectChanges();
            expect(radioInstances[0].checked).toBe(true);
            expect(groupInstance.value).toBe('fire');
            expect(groupInstance.selected).toBe(radioInstances[0]);
        });
        testing_1.it('should emit a change event from radio buttons', testing_1.fakeAsync(function () {
            expect(radioInstances[0].checked).toBe(false);
            var changeSpy = jasmine.createSpy('radio change listener');
            radioInstances[0].change.subscribe(changeSpy);
            radioInstances[0].checked = true;
            fixture.detectChanges();
            testing_1.tick();
            expect(changeSpy).toHaveBeenCalled();
            radioInstances[0].checked = false;
            fixture.detectChanges();
            testing_1.tick();
            expect(changeSpy).toHaveBeenCalledTimes(2);
        }));
        testing_1.it('should emit a change event from the radio group', testing_1.fakeAsync(function () {
            expect(groupInstance.value).toBeFalsy();
            var changeSpy = jasmine.createSpy('radio-group change listener');
            groupInstance.change.subscribe(changeSpy);
            groupInstance.value = 'fire';
            fixture.detectChanges();
            testing_1.tick();
            expect(changeSpy).toHaveBeenCalled();
            groupInstance.value = 'water';
            fixture.detectChanges();
            testing_1.tick();
            expect(changeSpy).toHaveBeenCalledTimes(2);
        }));
        // TODO(jelbourn): test this in an e2e test with *real* focus, rather than faking
        // a focus / blur event.
        testing_1.it('should focus individual radio buttons', function () {
            var nativeRadioInput = radioNativeElements[0].querySelector('input');
            expect(nativeRadioInput.classList).not.toContain('md-radio-focused');
            dispatchFocusChangeEvent('focus', nativeRadioInput);
            fixture.detectChanges();
            expect(radioNativeElements[0].classList).toContain('md-radio-focused');
            dispatchFocusChangeEvent('blur', nativeRadioInput);
            fixture.detectChanges();
            expect(radioNativeElements[0].classList).not.toContain('md-radio-focused');
        });
        testing_1.it('should update the group and radios when updating the group value', function () {
            expect(groupInstance.value).toBeFalsy();
            testComponent.groupValue = 'fire';
            fixture.detectChanges();
            expect(groupInstance.value).toBe('fire');
            expect(groupInstance.selected).toBe(radioInstances[0]);
            expect(radioInstances[0].checked).toBe(true);
            expect(radioInstances[1].checked).toBe(false);
            testComponent.groupValue = 'water';
            fixture.detectChanges();
            expect(groupInstance.value).toBe('water');
            expect(groupInstance.selected).toBe(radioInstances[1]);
            expect(radioInstances[0].checked).toBe(false);
            expect(radioInstances[1].checked).toBe(true);
        });
        testing_1.it('should deselect all of the checkboxes when the group value is cleared', function () {
            radioInstances[0].checked = true;
            expect(groupInstance.value).toBeTruthy();
            groupInstance.value = null;
            expect(radioInstances.every(function (radio) { return !radio.checked; })).toBe(true);
        });
    });
    testing_1.describe('group with ngModel', function () {
        var fixture;
        var groupDebugElement;
        var groupNativeElement;
        var radioDebugElements;
        var radioNativeElements;
        var groupInstance;
        var radioInstances;
        var testComponent;
        var groupNgControl;
        testing_1.beforeEach(testing_1.async(function () {
            builder.createAsync(RadioGroupWithNgModel).then(function (f) {
                fixture = f;
                fixture.detectChanges();
                testComponent = fixture.debugElement.componentInstance;
                groupDebugElement = fixture.debugElement.query(platform_browser_1.By.directive(radio_1.MdRadioGroup));
                groupNativeElement = groupDebugElement.nativeElement;
                groupInstance = groupDebugElement.injector.get(radio_1.MdRadioGroup);
                groupNgControl = groupDebugElement.injector.get(forms_1.NgControl);
                radioDebugElements = fixture.debugElement.queryAll(platform_browser_1.By.directive(radio_1.MdRadioButton));
                radioNativeElements = radioDebugElements.map(function (debugEl) { return debugEl.nativeElement; });
                radioInstances = radioDebugElements.map(function (debugEl) { return debugEl.componentInstance; });
            });
        }));
        testing_1.it('should set individual radio names based on the group name', function () {
            expect(groupInstance.name).toBeTruthy();
            for (var _i = 0, radioInstances_5 = radioInstances; _i < radioInstances_5.length; _i++) {
                var radio = radioInstances_5[_i];
                expect(radio.name).toBe(groupInstance.name);
            }
            groupInstance.name = 'new name';
            for (var _a = 0, radioInstances_6 = radioInstances; _a < radioInstances_6.length; _a++) {
                var radio = radioInstances_6[_a];
                expect(radio.name).toBe(groupInstance.name);
            }
        });
        testing_1.it('should check the corresponding radio button on group value change', function () {
            expect(groupInstance.value).toBeFalsy();
            for (var _i = 0, radioInstances_7 = radioInstances; _i < radioInstances_7.length; _i++) {
                var radio = radioInstances_7[_i];
                expect(radio.checked).toBeFalsy();
            }
            groupInstance.value = 'vanilla';
            for (var _a = 0, radioInstances_8 = radioInstances; _a < radioInstances_8.length; _a++) {
                var radio = radioInstances_8[_a];
                expect(radio.checked).toBe(groupInstance.value === radio.value);
            }
            expect(groupInstance.selected.value).toBe(groupInstance.value);
        });
        testing_1.it('should have the correct control state initially and after interaction', testing_1.fakeAsync(function () {
            // The control should start off valid, pristine, and untouched.
            expect(groupNgControl.valid).toBe(true);
            expect(groupNgControl.pristine).toBe(true);
            expect(groupNgControl.touched).toBe(false);
            // After changing the value programmatically, the control should become dirty (not pristine),
            // but remain untouched.
            radioInstances[1].checked = true;
            fixture.detectChanges();
            testing_1.tick();
            expect(groupNgControl.valid).toBe(true);
            expect(groupNgControl.pristine).toBe(false);
            expect(groupNgControl.touched).toBe(false);
            // After a user interaction occurs (such as a click), the control should remain dirty and
            // now also be touched.
            radioNativeElements[2].click();
            fixture.detectChanges();
            testing_1.tick();
            expect(groupNgControl.valid).toBe(true);
            expect(groupNgControl.pristine).toBe(false);
            expect(groupNgControl.touched).toBe(true);
        }));
        testing_1.it('should update the ngModel value when selecting a radio button', testing_1.fakeAsync(function () {
            radioInstances[1].checked = true;
            fixture.detectChanges();
            testing_1.tick();
            expect(testComponent.modelValue).toBe('chocolate');
        }));
    });
    testing_1.describe('group with ngModel and change event', function () {
        var fixture;
        var groupDebugElement;
        var groupNativeElement;
        var radioDebugElements;
        var radioNativeElements;
        var groupInstance;
        var radioInstances;
        var testComponent;
        var groupNgControl;
        testing_1.beforeEach(testing_1.async(function () {
            builder.createAsync(RadioGroupWithNgModel).then(function (f) {
                fixture = f;
                testComponent = fixture.componentInstance;
                groupDebugElement = fixture.debugElement.query(platform_browser_1.By.directive(radio_1.MdRadioGroup));
                groupNativeElement = groupDebugElement.nativeElement;
                groupInstance = groupDebugElement.injector.get(radio_1.MdRadioGroup);
                groupNgControl = groupDebugElement.injector.get(forms_1.NgControl);
                radioDebugElements = fixture.debugElement.queryAll(platform_browser_1.By.directive(radio_1.MdRadioButton));
                radioNativeElements = radioDebugElements.map(function (debugEl) { return debugEl.nativeElement; });
                radioInstances = radioDebugElements.map(function (debugEl) { return debugEl.componentInstance; });
                fixture.detectChanges();
            });
        }));
        testing_1.it('should update the model before firing change event', testing_1.fakeAsync(function () {
            expect(testComponent.modelValue).toBeUndefined();
            expect(testComponent.lastEvent).toBeUndefined();
            groupInstance.value = 'chocolate';
            fixture.detectChanges();
            testing_1.tick();
            expect(testComponent.modelValue).toBe('chocolate');
            expect(testComponent.lastEvent.value).toBe('chocolate');
        }));
    });
    testing_1.describe('as standalone', function () {
        var fixture;
        var radioDebugElements;
        var seasonRadioInstances;
        var weatherRadioInstances;
        var fruitRadioInstances;
        var fruitRadioNativeInputs;
        var testComponent;
        testing_1.beforeEach(testing_1.async(function () {
            builder.createAsync(StandaloneRadioButtons).then(function (f) {
                var fruitRadioNativeElements;
                fixture = f;
                fixture.detectChanges();
                testComponent = fixture.debugElement.componentInstance;
                radioDebugElements = fixture.debugElement.queryAll(platform_browser_1.By.directive(radio_1.MdRadioButton));
                seasonRadioInstances = radioDebugElements
                    .filter(function (debugEl) { return debugEl.componentInstance.name == 'season'; })
                    .map(function (debugEl) { return debugEl.componentInstance; });
                weatherRadioInstances = radioDebugElements
                    .filter(function (debugEl) { return debugEl.componentInstance.name == 'weather'; })
                    .map(function (debugEl) { return debugEl.componentInstance; });
                fruitRadioInstances = radioDebugElements
                    .filter(function (debugEl) { return debugEl.componentInstance.name == 'fruit'; })
                    .map(function (debugEl) { return debugEl.componentInstance; });
                fruitRadioNativeElements = radioDebugElements
                    .filter(function (debugEl) { return debugEl.componentInstance.name == 'fruit'; })
                    .map(function (debugEl) { return debugEl.nativeElement; });
                fruitRadioNativeInputs = [];
                for (var _i = 0, fruitRadioNativeElements_1 = fruitRadioNativeElements; _i < fruitRadioNativeElements_1.length; _i++) {
                    var element = fruitRadioNativeElements_1[_i];
                    fruitRadioNativeInputs.push(element.querySelector('input'));
                }
            });
        }));
        testing_1.it('should uniquely select radios by a name', function () {
            seasonRadioInstances[0].checked = true;
            weatherRadioInstances[1].checked = true;
            fixture.detectChanges();
            expect(seasonRadioInstances[0].checked).toBe(true);
            expect(seasonRadioInstances[1].checked).toBe(false);
            expect(seasonRadioInstances[2].checked).toBe(false);
            expect(weatherRadioInstances[0].checked).toBe(false);
            expect(weatherRadioInstances[1].checked).toBe(true);
            expect(weatherRadioInstances[2].checked).toBe(false);
            seasonRadioInstances[1].checked = true;
            fixture.detectChanges();
            expect(seasonRadioInstances[0].checked).toBe(false);
            expect(seasonRadioInstances[1].checked).toBe(true);
            expect(seasonRadioInstances[2].checked).toBe(false);
            expect(weatherRadioInstances[0].checked).toBe(false);
            expect(weatherRadioInstances[1].checked).toBe(true);
            expect(weatherRadioInstances[2].checked).toBe(false);
            weatherRadioInstances[2].checked = true;
            expect(seasonRadioInstances[0].checked).toBe(false);
            expect(seasonRadioInstances[1].checked).toBe(true);
            expect(seasonRadioInstances[2].checked).toBe(false);
            expect(weatherRadioInstances[0].checked).toBe(false);
            expect(weatherRadioInstances[1].checked).toBe(false);
            expect(weatherRadioInstances[2].checked).toBe(true);
        });
        testing_1.it('should add aria-label attribute to the underlying input element if defined', function () {
            expect(fruitRadioNativeInputs[0].getAttribute('aria-label')).toBe('Banana');
        });
        testing_1.it('should not add aria-label attribute if not defined', function () {
            expect(fruitRadioNativeInputs[1].hasAttribute('aria-label')).toBeFalsy();
        });
        testing_1.it('should change aria-label attribute if property is changed at runtime', function () {
            expect(fruitRadioNativeInputs[0].getAttribute('aria-label')).toBe('Banana');
            fruitRadioInstances[0].ariaLabel = 'Pineapple';
            fixture.detectChanges();
            expect(fruitRadioNativeInputs[0].getAttribute('aria-label')).toBe('Pineapple');
        });
        testing_1.it('should add aria-labelledby attribute to the underlying input element if defined', function () {
            expect(fruitRadioNativeInputs[0].getAttribute('aria-labelledby')).toBe('xyz');
        });
        testing_1.it('should not add aria-labelledby attribute if not defined', function () {
            expect(fruitRadioNativeInputs[1].hasAttribute('aria-labelledby')).toBeFalsy();
        });
        testing_1.it('should change aria-labelledby attribute if property is changed at runtime', function () {
            expect(fruitRadioNativeInputs[0].getAttribute('aria-labelledby')).toBe('xyz');
            fruitRadioInstances[0].ariaLabelledby = 'uvw';
            fixture.detectChanges();
            expect(fruitRadioNativeInputs[0].getAttribute('aria-labelledby')).toBe('uvw');
        });
    });
});
var RadiosInsideRadioGroup = (function () {
    function RadiosInsideRadioGroup() {
        this.isGroupDisabled = false;
        this.groupValue = null;
    }
    RadiosInsideRadioGroup = __decorate([
        core_1.Component({
            directives: [radio_1.MD_RADIO_DIRECTIVES],
            template: "\n  <md-radio-group [disabled]=\"isGroupDisabled\"\n                  [align]=\"alignment\"\n                  [value]=\"groupValue\"\n                  name=\"test-name\">\n    <md-radio-button value=\"fire\">Charmander</md-radio-button>\n    <md-radio-button value=\"water\">Squirtle</md-radio-button>\n    <md-radio-button value=\"leaf\">Bulbasaur</md-radio-button>\n  </md-radio-group>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], RadiosInsideRadioGroup);
    return RadiosInsideRadioGroup;
}());
var StandaloneRadioButtons = (function () {
    function StandaloneRadioButtons() {
    }
    StandaloneRadioButtons = __decorate([
        core_1.Component({
            directives: [radio_1.MD_RADIO_DIRECTIVES],
            template: "\n    <md-radio-button name=\"season\" value=\"spring\">Spring</md-radio-button>\n    <md-radio-button name=\"season\" value=\"summer\">Summer</md-radio-button>\n    <md-radio-button name=\"season\" value=\"autum\">Autumn</md-radio-button>\n    \n    <md-radio-button name=\"weather\" value=\"warm\">Spring</md-radio-button>\n    <md-radio-button name=\"weather\" value=\"hot\">Summer</md-radio-button>\n    <md-radio-button name=\"weather\" value=\"cool\">Autumn</md-radio-button>\n    \n    <span id=\"xyz\">Baby Banana<span>\n    <md-radio-button name=\"fruit\" value=\"banana\" aria-label=\"Banana\" aria-labelledby=\"xyz\">\n    </md-radio-button>\n    <md-radio-button name=\"fruit\" value=\"raspberry\">Raspberry</md-radio-button>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], StandaloneRadioButtons);
    return StandaloneRadioButtons;
}());
var RadioGroupWithNgModel = (function () {
    function RadioGroupWithNgModel() {
        this.options = [
            { label: 'Vanilla', value: 'vanilla' },
            { label: 'Chocolate', value: 'chocolate' },
            { label: 'Strawberry', value: 'strawberry' },
        ];
    }
    RadioGroupWithNgModel = __decorate([
        core_1.Component({
            directives: [radio_1.MD_RADIO_DIRECTIVES, forms_1.FORM_DIRECTIVES],
            template: "\n  <md-radio-group [(ngModel)]=\"modelValue\" (change)=\"lastEvent = $event\">\n    <md-radio-button *ngFor=\"let option of options\" [value]=\"option.value\">\n      {{option.label}}\n    </md-radio-button>\n  </md-radio-group>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], RadioGroupWithNgModel);
    return RadioGroupWithNgModel;
}());
// TODO(jelbourn): remove eveything below when Angular supports faking events.
/**
 * Dispatches a focus change event from an element.
 * @param eventName Name of the event, either 'focus' or 'blur'.
 * @param element The element from which the event will be dispatched.
 */
function dispatchFocusChangeEvent(eventName, element) {
    var event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    element.dispatchEvent(event);
}
//# sourceMappingURL=radio.spec.js.map