/*
  TODO: delegate WebSocket access to a supporting service class
 */
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
require('./rxjs-operators');
var ng2_websocket_1 = require('./ng2-websocket');
var http_1 = require('@angular/http');
var prediction_service_1 = require("./service/prediction.service");
var button_1 = require('@angular2-material/button');
var toolbar_1 = require('@angular2-material/toolbar');
var AngularWebsocketsDemoAppComponent = (function () {
    function AngularWebsocketsDemoAppComponent(predictionService) {
        this.predictionService = predictionService;
        //numInputs: number;
        this.inputValues = [];
        this.inputFeatureNames = [];
        this.curSampleName = "";
        //TODO: Modify to inject into constructor?
        //this.ws = new $WebSocket("wss://visualneuralnetservice.cfapps.io:4443/counter");
        this.ws = new ng2_websocket_1.$WebSocket("ws://localhost:8080/counter");
    }
    AngularWebsocketsDemoAppComponent.prototype.connectToWebSocket = function () {
        var _this = this;
        var subject;
        console.log("Connect button clicked");
        this.ws.connect(false);
        console.log("ws.getReadyState(): " + this.ws.getReadyState());
        subject = this.ws.getDataStream();
        if (subject.observers == null || subject.observers.length == 0) {
            subject.subscribe(function (evt) {
                //var count = JSON.parse(evt.data).value;
                //console.log('Got: ' + evt.data);
                console.log('Got: ' + evt.data);
                var jsonObject = JSON.parse(evt.data);
                _this.updateNeuralNetGraph(jsonObject);
                // TODO: Uncomment when Vis Graph2d works in this environment
                //this.updateScoreGraph(jsonObject);
            }, function (e) {
                console.log('Error: ' + e.message);
            }, function () {
                console.log('Completed!');
            });
        }
    };
    AngularWebsocketsDemoAppComponent.prototype.handleUnsubscribeButtonClicked = function () {
        console.log("Unsubscribe button clicked");
        console.log("ws.getReadyState(): " + this.ws.getReadyState());
        this.ws.getDataStream().unsubscribe();
    };
    AngularWebsocketsDemoAppComponent.prototype.handleDisconnectButtonClicked = function () {
        console.log("Disconnect button clicked");
        console.log("ws.getReadyState(): " + this.ws.getReadyState());
        this.ws.close(true);
    };
    /*
    handleSendButtonClicked() {
      console.log("Send button clicked");
      console.log("ws.getReadyState(): " + this.ws.getReadyState());
  
      //let name = "James";
  
      //this.ws.send(JSON.stringify({ 'name': name }));
      this.ws.send(JSON.stringify({ 'name': this.inputName }));
    }
    */
    AngularWebsocketsDemoAppComponent.prototype.handleSampleButtonClicked = function (sampleName) {
        console.log("Sample button clicked: " + sampleName);
        console.log("ws.getReadyState(): " + this.ws.getReadyState());
        this.curSampleName = sampleName;
        //let name = "James";
        //this.ws.send(JSON.stringify({ 'name': name }));
        this.ws.send(JSON.stringify({ 'name': sampleName }));
    };
    AngularWebsocketsDemoAppComponent.prototype.handlePredictButtonClicked = function () {
        var _this = this;
        console.log("Predict button clicked, inputValues: " + this.inputValues);
        this.predictionService.getPredictionResponse(this.inputValues)
            .subscribe(function (predictionResponse) {
            _this.predictionResponse = predictionResponse;
            _this.updateActivationsPrediction(predictionResponse);
        }, function (error) { return _this.errorMessage = error; });
    };
    AngularWebsocketsDemoAppComponent.prototype.ngAfterViewInit = function () {
        this.connectToWebSocket();
    };
    AngularWebsocketsDemoAppComponent.prototype.updateNeuralNetGraph = function (results) {
        // Make note of the number of inputs TODO: perhaps remove this and the numInputs member variable
        //this.numInputs = results.neuralNetLayerList[0].neuralNetNodeList.length;
        // Create an array element for each input
        this.inputValues = [];
        this.inputFeatureNames = [];
        for (var inputIdx in results.neuralNetLayerList[0].neuralNetNodeList) {
            //console.log("inputIdx: " + inputIdx);
            var neuralNode = results.neuralNetLayerList[0].neuralNetNodeList[inputIdx];
            if (neuralNode != undefined) {
                this.inputFeatureNames.push(neuralNode.name);
            }
            this.inputValues.push("");
        }
        this.nodes = new vis.DataSet(results.nodes);
        this.edges = new vis.DataSet(results.edges);
        var data = {
            nodes: this.nodes,
            edges: this.edges
        };
        this.network = new vis.Network(this.div.nativeElement, data, this.createGraphOptions());
    };
    AngularWebsocketsDemoAppComponent.prototype.updateActivationsPrediction = function (predictionResp) {
        if (predictionResp != null) {
        }
        var numInputs = this.inputFeatureNames.length;
        var nodeLabel = "";
        for (var nodeId in predictionResp.activations) {
            nodeLabel = this.createNodeLabel(predictionResp.activations[nodeId] + ((predictionResp.inputsNormalized && Number(nodeId) < numInputs) ? "n" : ""));
            this.nodes.update([{ id: nodeId, image: nodeLabel, shape: 'circularImage', borderWidth: "1" }]);
            // Put wider border around predicted label
            if (Number(nodeId) == predictionResp.activations.length - predictionResp.numOutputNodes + predictionResp.prediction) {
                this.nodes.update([{ id: nodeId, borderWidth: "5" }]);
            }
        }
        this.network.setOptions(this.createGraphOptions());
    };
    AngularWebsocketsDemoAppComponent.prototype.createNodeLabel = function (label) {
        var data = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">' +
            '<rect x="0" y="0" width="100%" height="100%" fill="#ffffff" ></rect>' +
            '<foreignObject x="10" y="11" width="100%" height="100%">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:6px">' +
            '<span style="color:black;">' + label +
            '</span>' +
            '</div>' +
            '</foreignObject>' +
            '</svg>';
        var DOMURL = window.URL;
        var img = new Image();
        var svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
        var url = DOMURL.createObjectURL(svg);
        return url;
    };
    AngularWebsocketsDemoAppComponent.prototype.createGraphOptions = function () {
        var graphOptions = {
            nodes: {
                borderWidth: 1,
                size: 40,
                color: {
                    border: '#406897',
                    background: '#6AAFFF'
                },
                font: { color: '#000000' },
                shape: 'circularImage',
                shapeProperties: {
                    useBorderWithImage: true
                }
            },
            edges: {
                color: 'lightgray',
                font: {
                    color: '#000000',
                    size: 14,
                    align: 'top'
                },
                arrowStrikethrough: false,
                scaling: {
                    label: {
                        enabled: true
                    }
                }
            },
            physics: {
                enabled: false
            },
            layout: {
                improvedLayout: true,
                hierarchical: {
                    enabled: true,
                    levelSeparation: 300,
                    nodeSpacing: 125,
                    direction: 'LR',
                    sortMethod: 'directed',
                    blockShifting: true,
                    edgeMinimization: true
                }
            }
        };
        return graphOptions;
    };
    // TODO: Work out this functionality
    AngularWebsocketsDemoAppComponent.prototype.updateScoreGraph = function (results) {
        var items = [
            { x: '2014-06-11', y: 10 },
            { x: '2014-06-12', y: 25 },
            { x: '2014-06-13', y: 30 },
            { x: '2014-06-14', y: 10 },
            { x: '2014-06-15', y: 15 },
            { x: '2014-06-16', y: 30 }
        ];
        var dataset = new vis.DataSet(items);
        var options = {};
        this.graph2d = new vis.Graph2d(this.scoreGraph.nativeElement, dataset, options);
    };
    __decorate([
        core_1.ViewChild('neuralNetGraph'), 
        __metadata('design:type', core_1.ElementRef)
    ], AngularWebsocketsDemoAppComponent.prototype, "div", void 0);
    __decorate([
        core_1.ViewChild('scoreGraph'), 
        __metadata('design:type', core_1.ElementRef)
    ], AngularWebsocketsDemoAppComponent.prototype, "scoreGraph", void 0);
    AngularWebsocketsDemoAppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'angular-websockets-demo-app',
            styleUrls: ['angular-websockets-demo.component.css'],
            providers: [prediction_service_1.PredictionService, http_1.HTTP_PROVIDERS],
            templateUrl: 'angular-websockets-demo.component.html',
            directives: [button_1.MD_BUTTON_DIRECTIVES, toolbar_1.MD_TOOLBAR_DIRECTIVES] //, MD_RADIO_DIRECTIVES,FORM_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [prediction_service_1.PredictionService])
    ], AngularWebsocketsDemoAppComponent);
    return AngularWebsocketsDemoAppComponent;
}());
exports.AngularWebsocketsDemoAppComponent = AngularWebsocketsDemoAppComponent;
//# sourceMappingURL=angular-websockets-demo.component.js.map