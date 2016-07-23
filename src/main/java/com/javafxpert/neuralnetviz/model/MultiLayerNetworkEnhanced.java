package com.javafxpert.neuralnetviz.model;

import org.deeplearning4j.nn.conf.MultiLayerConfiguration;
import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;

import java.util.Arrays;

/**
 * Created by jamesweaver on 7/22/16.
 */
public class MultiLayerNetworkEnhanced extends MultiLayerNetwork {
  private String[] inputFeatureNames = {};
  private String[] outputLabelNames = {};

  public MultiLayerNetworkEnhanced(MultiLayerConfiguration multiLayerConfiguration,
                                   String[] inputFeatureNames,
                                   String[] outputLabelNames) {
    super(multiLayerConfiguration);
    if (inputFeatureNames != null) {
      this.inputFeatureNames = inputFeatureNames;
    }
    if (outputLabelNames != null) {
      this.outputLabelNames = outputLabelNames;
    }
  }

  public String[] getInputFeatureNames() {
    return inputFeatureNames;
  }

  public void setInputFeatureNames(String[] inputFeatureNames) {
    this.inputFeatureNames = inputFeatureNames;
  }

  public String[] getOutputLabelNames() {
    return outputLabelNames;
  }

  public void setOutputLabelNames(String[] outputLabelNames) {
    this.outputLabelNames = outputLabelNames;
  }

  @Override
  public String toString() {
    return "MultiLayerNetworkEnhanced{" +
        "inputFeatureNames=" + Arrays.toString(inputFeatureNames) +
        ", outputLabelNames=" + Arrays.toString(outputLabelNames) +
        '}';
  }
}
