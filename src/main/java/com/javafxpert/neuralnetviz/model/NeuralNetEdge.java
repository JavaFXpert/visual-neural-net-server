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
