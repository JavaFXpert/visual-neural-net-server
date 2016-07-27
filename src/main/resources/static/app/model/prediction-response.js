"use strict";
/**
 * Created by jamesweaver on 7/19/16.
 */
var PredictionResponse = (function () {
    function PredictionResponse(prediction, activations, numOutputNodes, inputsNormalized) {
        this.prediction = prediction;
        this.activations = activations;
        this.numOutputNodes = numOutputNodes;
        this.inputsNormalized = inputsNormalized;
    }
    return PredictionResponse;
}());
exports.PredictionResponse = PredictionResponse;
//# sourceMappingURL=prediction-response.js.map