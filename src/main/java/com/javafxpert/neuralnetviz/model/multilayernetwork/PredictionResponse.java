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
