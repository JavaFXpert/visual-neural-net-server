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
}
