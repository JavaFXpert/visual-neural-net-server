package com.javafxpert.neuralnetviz.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"id", "label"})

/**
 * Created by jamesweaver on 7/12/16.
 */
public class NeuralNetNode {
  @JsonProperty("id")
  private String id;  // Node ID

  @JsonProperty("label")
  private String bias;
}
