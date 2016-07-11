package com.javafxpert.neuralnetviz.model;

import org.deeplearning4j.nn.api.Model;
import org.deeplearning4j.optimize.api.IterationListener;

import org.nd4j.linalg.api.ndarray.INDArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

            //Process parameters: duplicate + calculate and store mean magnitudes
            Map<String,INDArray> params = model.paramTable();
            Map<String,Map> newParams = new LinkedHashMap<>();
            for(Map.Entry<String,INDArray> entry : params.entrySet()) {
                String param = entry.getKey();
                String newName;
                if(Character.isDigit(param.charAt(0))) newName = "param_" + param;
                else newName = param;

                System.out.println("updates newName: " + newName + " \n" + entry.getValue().dup());
                try {
                    webSocketSession.sendMessage(new TextMessage("modelJson: " + entry.getValue().dup()));
                }
                catch(IOException ioe) {
                    ioe.printStackTrace();
                }


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
}
