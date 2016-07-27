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
package com.javafxpert.neuralnetviz.model.multilayernetwork;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jamesweaver on 7/18/16.
 */

@JsonRootName("prediction")
public class PredictionResponse {
  @JsonProperty("prediction")
  private int prediction;

  @JsonProperty("activations")
  private List<Double> activations = new ArrayList<>();

  @JsonProperty("numOutputNodes")
  private int numOutputNodes;

  @JsonProperty("inputsNormalized")
  private boolean inputsNormalized;

  public PredictionResponse() {
  }

  public PredictionResponse(boolean inputsNormalized, int prediction, List<Double> activations, int numOutputNodes) {
    this.inputsNormalized = inputsNormalized;
    this.prediction = prediction;
    this.activations = activations;
    this.numOutputNodes = numOutputNodes;
  }

  public int getPrediction() {
    return prediction;
  }

  public void setPrediction(int prediction) {
    this.prediction = prediction;
  }

  public List<Double> getActivations() {
    return activations;
  }

  public void setActivations(List<Double> activations) {
    this.activations = activations;
  }

  public int getNumOutputNodes() {
    return numOutputNodes;
  }

  public void setNumOutputNodes(int numOutputNodes) {
    this.numOutputNodes = numOutputNodes;
  }

  public boolean isInputsNormalized() {
    return inputsNormalized;
  }

  public void setInputsNormalized(boolean inputsNormalized) {
    this.inputsNormalized = inputsNormalized;
  }

  @Override
  public String toString() {
    return "PredictionResponse{" +
        "prediction=" + prediction +
        ", activations=" + activations +
        ", numOutputNodes=" + numOutputNodes +
        ", inputsNormalized=" + inputsNormalized +
        '}';
  }
}
