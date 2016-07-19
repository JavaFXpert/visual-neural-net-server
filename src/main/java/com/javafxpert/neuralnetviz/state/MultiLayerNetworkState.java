package com.javafxpert.neuralnetviz.state;

import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;

/**
 * Created by jamesweaver on 7/18/16.
 */
public class MultiLayerNetworkState {
  private static MultiLayerNetwork neuralNetworkModel;

  public static MultiLayerNetwork getNeuralNetworkModel() {
    return neuralNetworkModel;
  }

  public static void setNeuralNetworkModel(MultiLayerNetwork neuralNetworkModel) {
    MultiLayerNetworkState.neuralNetworkModel = neuralNetworkModel;
  }
}
