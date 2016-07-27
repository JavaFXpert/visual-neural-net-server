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
/**
 * Created by jamesweaver on 7/19/16.
 */
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var PredictionService = (function () {
    function PredictionService(http) {
        this.http = http;
        this.predictionUrl = 'http://localhost:8080/prediction?values='; // URL to web API
    }
    PredictionService.prototype.getPredictionResponse = function (inputValues) {
        return this.http.get(this.predictionUrl + inputValues.join())
            .map(this.extractData)
            .catch(this.handleError);
    };
    PredictionService.prototype.extractData = function (res) {
        var body = res.json();
        //return body.data || { };
        return body || {};
    };
    PredictionService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    PredictionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PredictionService);
    return PredictionService;
}());
exports.PredictionService = PredictionService;
//# sourceMappingURL=prediction.service.js.map