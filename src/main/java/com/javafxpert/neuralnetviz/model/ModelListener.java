package com.javafxpert.neuralnetviz.model;

import org.deeplearning4j.nn.api.Model;
import org.deeplearning4j.optimize.api.IterationListener;

import org.nd4j.linalg.api.ndarray.INDArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.*;

/**
 * Created by jamesweaver on 6/28/16.
 */
public class ModelListener implements IterationListener {
    private static final Logger log = LoggerFactory.getLogger(ModelListener.class);
    private List<Map<String,List<Double>>> meanMagHistoryParams = new ArrayList<>();    //1 map per layer; keyed by new param name
    private List<Map<String,List<Double>>> meanMagHistoryUpdates = new ArrayList<>();
    private int iterations = 1;
    private Map<String,Integer> layerNameIndexes = new HashMap<>();
    private List<String> layerNames = new ArrayList<>();
    private int layerNameIndexesCount = 0;

    private WebSocketSession webSocketSession;

    private int iters = 0;

    public ModelListener(int iterations, WebSocketSession webSocketSession) {
        this.iterations = iterations;
        this.webSocketSession = webSocketSession;
    }

    @Override
    public boolean invoked() {
        return false;
    }

    @Override
    public void invoke() {

    }

    @Override
    public void iterationDone(Model model, int iteration) {
        //log.warn("iters++ " + iters++);
        if(iteration % iterations == 0) {
            System.out.println("In iterationDone():");
            Map<String, Map> newGrad = new LinkedHashMap<>();
            try {
                Map<String, INDArray> grad = model.gradient().gradientForVariable();

                log.warn("Starting report building...");

                if (meanMagHistoryParams.size() == 0) {
                    //Initialize:
                    int maxLayerIdx = -1;
                    for (String s : grad.keySet()) {
                        maxLayerIdx = Math.max(maxLayerIdx, indexFromString(s));
                    }
                    if (maxLayerIdx == -1) maxLayerIdx = 0;
                    for (int i = 0; i <= maxLayerIdx; i++) {
                        meanMagHistoryParams.add(new LinkedHashMap<String, List<Double>>());
                        meanMagHistoryUpdates.add(new LinkedHashMap<String, List<Double>>());
                    }
                }

                for (Map.Entry<String, INDArray> entry : grad.entrySet()) {
                    String param = entry.getKey();
                    String newName;
                    if (Character.isDigit(param.charAt(0))) newName = "param_" + param;
                    else newName = param;

                    //log.warn("params newName: " + newName + " \n" + entry.getValue().dup());

                    /*
                    HistogramBin histogram = new HistogramBin.Builder(entry.getValue().dup())
                        .setBinCount(20)
                        .setRounding(6)
                        .build();
                    */

                    //newGrad.put(newName, histogram.getData());
                    //CSS identifier can't start with digit http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier


                    int idx = indexFromString(param);
                    if (idx >= meanMagHistoryUpdates.size()) {
                        //log.info("Can't find idx for update ["+newName+"]");
                        meanMagHistoryUpdates.add(new LinkedHashMap<String, List<Double>>());
                    }

                    //Work out layer index:
                    Map<String, List<Double>> map = meanMagHistoryUpdates.get(idx);
                    List<Double> list = map.get(newName);
                    if (list == null) {
                        list = new ArrayList<>();
                        map.put(newName, list);
                    }
                    double meanMag = entry.getValue().norm1Number().doubleValue() / entry.getValue().length();
                    list.add(meanMag);

                }
            } catch (Exception e) {
                log.warn("Exception: " + e);
            }

            // Create instance of NeuralNetGraph to populate in multiple invocations of populateNeuralNetModel()
            NeuralNetGraph neuralNetGraph = new NeuralNetGraph();

            //Process parameters: duplicate + calculate and store mean magnitudes
            Map<String,INDArray> params = model.paramTable();
            Map<String,Map> newParams = new LinkedHashMap<>();
            for(Map.Entry<String,INDArray> entry : params.entrySet()) {
                String param = entry.getKey();
                INDArray value = entry.getValue().dup();

                String newName; // TODO perhaps remove

                char firstChar = param.charAt(0);
                if(Character.isDigit(firstChar)) {
                    newName = "param_" + param;
                    //System.out.println("updates newName: " + newName + " \n" + entry.getValue().dup());

                    int layerNum = Character.getNumericValue(firstChar) + 1;
                    boolean containsWeights = false;

                    // param should take the form of 0_W or 0_b where first digit is layer number - 1
                    // Assumption: "W" entry appears before "b" entry for a given layer
                    if (param.length() == 3 && param.charAt(1) == '_' && (param.charAt(2) == 'W' || param.charAt(2) == 'b')) {
                        containsWeights = param.charAt(2) == 'W';

                        // Populate NeuralNet* model classes
                        populateNeuralNetModel(neuralNetGraph, layerNum, containsWeights, value);
                    }
                }
                else {
                    newName = param;
                }

                /*
                try {
                    webSocketSession.sendMessage(new TextMessage("modelJson: " + entry.getValue().dup()));
                }
                catch(IOException ioe) {
                    ioe.printStackTrace();
                }
                */


                /*
                HistogramBin histogram = new HistogramBin.Builder(entry.getValue().dup())
                    .setBinCount(20)
                    .setRounding(6)
                    .build();
                newParams.put(newName, histogram.getData());
                //dup() because params might be a view
                */

                int idx = indexFromString(param);
                if (idx >= meanMagHistoryParams.size()) {
                    //log.info("Can't find idx for param ["+newName+"]");
                    meanMagHistoryParams.add(new LinkedHashMap<String,List<Double>>());
                }

                Map<String,List<Double>> map = meanMagHistoryParams.get(idx);
                List<Double> list = map.get(newName);
                if(list==null){
                    list = new ArrayList<>();
                    map.put(newName,list);
                }
                double meanMag = entry.getValue().norm1Number().doubleValue() / entry.getValue().length();
                list.add(meanMag);
            }
            System.out.println("neuralNetGraph: " + neuralNetGraph);

        }

    }

    private int indexFromString(String str) {
        int underscore = str.indexOf("_");
        if (underscore == -1) {
            if (!layerNameIndexes.containsKey(str)) {
                layerNames.add(str);
                layerNameIndexes.put(str, layerNameIndexesCount++);
            }
            return layerNameIndexes.get(str);
        } else {
            String subStr = str.substring(0,underscore);
            if(!layerNameIndexes.containsKey(subStr)){
                layerNames.add(subStr);
                layerNameIndexes.put(subStr,layerNameIndexesCount++);
            }
            return layerNameIndexes.get(subStr);
        }
    }

    private void populateNeuralNetModel(NeuralNetGraph neuralNetGraph, int layerNum, boolean containsWeights, INDArray entry) {
        System.out.println("In populateNeuralNetModel, layerNum: " + layerNum + ", containsWeights: " + containsWeights + ", entry: " + entry);

        int curNodeId = 0; // zero based

        // Populate a layer with nodes and edges
        if (layerNum == 1 && containsWeights) {
            // Create nodes for layer 0 (the input layer), as they are not reported and contain no weights or bias or edges
            NeuralNetLayer inputLayer = new NeuralNetLayer();
            inputLayer.setLayerNum(0);
            neuralNetGraph.getNeuralNetLayerList().add(inputLayer);

            // The number of nodes in the input layer is the same as the number of edges in a given node in layer 1, which
            // is also the same as the number of rows in the weights array
            int numInputLayerNodes = entry.rows();
            for (int i = 0; i < numInputLayerNodes; i++) {
                NeuralNetNode node = new NeuralNetNode();
                node.setId("" + curNodeId++);
                inputLayer.getNeuralNetNodeList().add(node);
                neuralNetGraph.getNeuralNetNodeList().add(node);
            }
        }
        if (layerNum >= 1) {
            if (containsWeights) {
                // Create a layer and add it to the NeuralNetGraph
                NeuralNetLayer curLayer = new NeuralNetLayer();
                curLayer.setLayerNum(layerNum);
                neuralNetGraph.getNeuralNetLayerList().add(curLayer);
                if (layerNum != neuralNetGraph.getNeuralNetLayerList().size() - 1) {
                    System.out.println("Unexpected condition: layerNum: " + layerNum +
                        " should equal neuralNetGraph.getNeuralNetLayerList().size() - 1: " +
                        (neuralNetGraph.getNeuralNetLayerList().size() - 1));
                }

                // Create/add nodes to the layer and graph for each column in the weights array
                int numCurLayerNodes = entry.columns();
                for (int i = 0; i < numCurLayerNodes; i++) {
                    NeuralNetNode node = new NeuralNetNode();
                    node.setId("" + curNodeId++);
                    curLayer.getNeuralNetNodeList().add(node);
                    neuralNetGraph.getNeuralNetNodeList().add(node);
                }

                // Create/add edge to the graph for each weight
                int numPrevLayerNodes = entry.rows();
                for (int row = 0; row < numPrevLayerNodes; row++) {
                    for (int col = 0; col < numCurLayerNodes; col++) {
                        NeuralNetEdge neuralNetEdge = new NeuralNetEdge();
                        neuralNetEdge.setWeight("" + entry.getDouble(row, col));
                        neuralNetEdge.setArrowDirection("to");
                        neuralNetEdge.setFromId("" + neuralNetGraph.getNeuralNetLayerList().get(layerNum - 1).getNeuralNetNodeList().get(row));
                        neuralNetEdge.setToId("" + neuralNetGraph.getNeuralNetLayerList().get(layerNum).getNeuralNetNodeList().get(col));
                        neuralNetGraph.getNeuralNetEdgeList().add(neuralNetEdge);
                    }
                }
            }
            else {
                // This entry contains biases so update the nodes in this layer with them
                NeuralNetLayer currentLayer = neuralNetGraph.getNeuralNetLayerList().get(layerNum);
                int numBiases = entry.columns();
                for (int bIdx = 0; bIdx < numBiases; bIdx++) {
                    currentLayer.getNeuralNetNodeList().get(bIdx).setBias("" + entry.getDouble(bIdx));
                }
            }
        }

        /*
        try {
            //webSocketSession.sendMessage(new TextMessage("modelJson: " + entry));
        }
        catch(IOException ioe) {
            ioe.printStackTrace();
        }
        */
    }
}
