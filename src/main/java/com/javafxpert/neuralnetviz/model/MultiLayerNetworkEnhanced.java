package com.javafxpert.neuralnetviz.model;

import org.deeplearning4j.nn.conf.MultiLayerConfiguration;
import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;
import org.nd4j.linalg.dataset.api.preprocessor.DataNormalization;
import org.nd4j.linalg.dataset.api.preprocessor.NormalizerStandardize;

import java.util.Arrays;

/**
 * Created by jamesweaver on 7/22/16.
 */
public class MultiLayerNetworkEnhanced extends MultiLayerNetwork {
  private String[] inputFeatureNames = {};
  private String[] outputLabelNames = {};
  private DataNormalization dataNormalization = new NormalizerStandardize();

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

  public DataNormalization getDataNormalization() {
    return dataNormalization;
  }

  public void setDataNormalization(DataNormalization dataNormalization) {
    this.dataNormalization = dataNormalization;
  }
}
