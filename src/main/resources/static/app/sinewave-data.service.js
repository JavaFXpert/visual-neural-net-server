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
var Rx_1 = require('rxjs/Rx');
var core_1 = require('@angular/core');
var SineWaveDataService = (function () {
    function SineWaveDataService() {
    }
    SineWaveDataService.prototype.observableSineWave = function (increment, period) {
        var subject = new Rx_1.ReplaySubject(1);
        var ws = new WebSocket('ws://' + window.location.hostname + ':' + window.location.port, 'hello');
        alert("ws.url: " + ws.url);
        console.log("ws.url: " + ws.url);
        ws.onmessage = function (e) {
            return subject.next(e.data);
        };
        return subject;
    };
    SineWaveDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SineWaveDataService);
    return SineWaveDataService;
}());
exports.SineWaveDataService = SineWaveDataService;
//# sourceMappingURL=sinewave-data.service.js.map