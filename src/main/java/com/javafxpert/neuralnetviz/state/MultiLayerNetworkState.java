package com.javafxpert.neuralnetviz.state;

import com.javafxpert.neuralnetviz.model.MultiLayerNetworkEnhanced;
import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;

/**
 * Created by jamesweaver on 7/18/16.
 */
public class MultiLayerNetworkState {
  private static MultiLayerNetworkEnhanced neuralNetworkModel;

  public static MultiLayerNetworkEnhanced getNeuralNetworkModel() {
    return neuralNetworkModel;
  }

  public static void setNeuralNetworkModel(MultiLayerNetworkEnhanced neuralNetworkModel) {
    MultiLayerNetworkState.neuralNetworkModel = neuralNetworkModel;
  }
}