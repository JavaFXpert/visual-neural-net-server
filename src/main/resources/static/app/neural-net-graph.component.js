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
 * Created by jamesweaver on 7/14/16.
 */
var core_1 = require('@angular/core');
var NeuralNetGraphComponent = (function () {
    function NeuralNetGraphComponent() {
        var json = '{"nodes":[{"id": "0","label": ""},{"id": "2","label": "-4.45"}],"edges": [{"from": "0","to": "2","arrows": "to","label": "2.6"}]}';
    }
    NeuralNetGraphComponent.prototype.ngAfterViewInit = function () {
        var results = {
            nodes: [
                {
                    id: "0",
                    label: "",
                    image: '../image/sigmoid.png'
                },
                {
                    id: "2",
                    label: "-4.45",
                    image: '../image/sigmoid.png'
                }
            ],
            edges: [
                {
                    from: "0",
                    to: "2",
                    arrows: "to",
                    label: "2.6"
                }
            ]
        };
        var nodes = new vis.DataSet(results.nodes);
        var edges = new vis.DataSet(results.edges);
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
            nodes: {
                borderWidth: 1,
                size: 30,
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
                font: { color: '#000000', size: 14, align: 'top' }
            }
        };
        var network = new vis.Network(this.div.nativeElement, data, options);
    };
    __decorate([
        core_1.ViewChild('neuralNetGraph'), 
        __metadata('design:type', core_1.ElementRef)
    ], NeuralNetGraphComponent.prototype, "div", void 0);
    NeuralNetGraphComponent = __decorate([
        core_1.Component({
            //moduleId: module.id,
            selector: 'neural-net-graph',
            styleUrls: ['app/neural-net-graph.component.css'],
            //styleUrls: ['../css/vis.min.css'],
            providers: [],
            templateUrl: 'app/neural-net-graph.component.html',
            directives: []
        }), 
        __metadata('design:paramtypes', [])
    ], NeuralNetGraphComponent);
    return NeuralNetGraphComponent;
}());
exports.NeuralNetGraphComponent = NeuralNetGraphComponent;
//# sourceMappingURL=neural-net-graph.component.js.map