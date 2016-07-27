/*
 * Copyright 2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
  private DataNormalization dataNormalization;

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
