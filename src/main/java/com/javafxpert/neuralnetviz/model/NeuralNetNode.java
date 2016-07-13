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

  public NeuralNetNode() {
  }

  public NeuralNetNode(String id, String bias) {
    this.id = id;
    this.bias = bias;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getBias() {
    return bias;
  }

  public void setBias(String bias) {
    this.bias = bias;
  }

  @Override
  public String toString() {
    return "NeuralNetNode{" +
        "id='" + id + '\'' +
        ", bias='" + bias + '\'' +
        '}';
  }
}
