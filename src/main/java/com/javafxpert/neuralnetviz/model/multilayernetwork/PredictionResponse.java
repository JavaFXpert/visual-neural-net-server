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

  public PredictionResponse() {
  }

  public PredictionResponse(int prediction, List<Double> activations) {
    this.prediction = prediction;
    this.activations = activations;
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

  @Override
  public String toString() {
    return "PredictionResponse{" +
        "prediction=" + prediction +
        ", activations=" + activations +
        '}';
  }
}
