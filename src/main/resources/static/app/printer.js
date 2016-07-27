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
var Rx_1 = require('rxjs/Rx');
var Printer = (function () {
    function Printer(detector) {
        this.detector = detector;
        this.data = [];
    }
    Printer.prototype.ngOnInit = function () {
        var _this = this;
        this.incomingData.subscribe(function (dataPoint) {
            _this.data.push(JSON.parse(dataPoint).value);
            if (_this.data.length > 10) {
            }
            _this.detector.detectChanges();
        }, function (error) {
            alert("Error occurred " + error);
        });
    };
    Printer.MAX_DATA = 10;
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Printer.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Printer.prototype, "width", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Printer.prototype, "height", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Rx_1.ReplaySubject)
    ], Printer.prototype, "incomingData", void 0);
    Printer = __decorate([
        core_1.Component({
            selector: 'printer',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <h3>Data</h3>\n    <table>\n    <tr *ngFor=\"let item of data\">\n        <td>{{ item }}</td>\n    </tr>\n    </table>\n"
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], Printer);
    return Printer;
}());
exports.Printer = Printer;
//# sourceMappingURL=printer.js.map