package com.javafxpert.neuralnetviz.model.multilayernetwork;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;

/**
 * Created by jamesweaver on 7/18/16.
 */

@JsonRootName("prediction")
public class PredictionResponse {
  @JsonProperty("prediction")
  private int prediction;

  public PredictionResponse() {
  }

  public PredictionResponse(int prediction) {
    this.prediction = prediction;
  }

  public int getPrediction() {
    return prediction;
  }

  public void setPrediction(int prediction) {
    this.prediction = prediction;
  }

  @Override
  public String toString() {
    return "PredictionResponse{" +
        "prediction=" + prediction +
        '}';
  }
}
