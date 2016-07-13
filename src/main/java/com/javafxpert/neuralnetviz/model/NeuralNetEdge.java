package com.javafxpert.neuralnetviz.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jamesweaver on 7/12/16.
 */
public class NeuralNetEdge {
  @JsonProperty("from")
  private String fromId;

  @JsonProperty("to")
  private String toId;

  @JsonProperty("arrows")
  private String arrowDirection;

  @JsonProperty("label")
  private String weight;

  public NeuralNetEdge() {
  }

  public NeuralNetEdge(String fromId, String toId, String arrowDirection, String weight) {
    this.fromId = fromId;
    this.toId = toId;
    this.arrowDirection = arrowDirection;
    this.weight = weight;
  }

  public String getFromId() {
    return fromId;
  }

  public void setFromId(String fromId) {
    this.fromId = fromId;
  }

  public String getToId() {
    return toId;
  }

  public void setToId(String toId) {
    this.toId = toId;
  }

  public String getArrowDirection() {
    return arrowDirection;
  }

  public void setArrowDirection(String arrowDirection) {
    this.arrowDirection = arrowDirection;
  }

  public String getWeight() {
    return weight;
  }

  public void setWeight(String weight) {
    this.weight = weight;
  }

  @Override
  public String toString() {
    return "NeuralNetEdge{" +
        "fromId='" + fromId + '\'' +
        ", toId='" + toId + '\'' +
        ", arrowDirection='" + arrowDirection + '\'' +
        ", weight='" + weight + '\'' +
        '}';
  }
}
