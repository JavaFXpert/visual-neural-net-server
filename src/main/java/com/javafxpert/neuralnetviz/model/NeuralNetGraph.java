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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonRootName;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by jamesweaver on 7/12/16.
 */
@JsonRootName("graph")
@JsonPropertyOrder({"nodes", "edges"})

@JsonIgnoreProperties(ignoreUnknown = true)
public class NeuralNetGraph implements Serializable {
  @JsonProperty("nodes")
  private List<NeuralNetNode> neuralNetNodeList = new ArrayList<>();

  @JsonProperty("edges")
  private List<NeuralNetEdge> neuralNetEdgeList = new ArrayList<>();

  private List<NeuralNetLayer> neuralNetLayerList = new ArrayList<>();

  public NeuralNetGraph() {
  }

  public NeuralNetGraph(List<NeuralNetNode> neuralNetNodeList, List<NeuralNetEdge> neuralNetEdgeList, List<NeuralNetLayer> neuralNetLayerList) {
    this.neuralNetNodeList = neuralNetNodeList;
    this.neuralNetEdgeList = neuralNetEdgeList;
    this.neuralNetLayerList = neuralNetLayerList;
  }

  public List<NeuralNetNode> getNeuralNetNodeList() {
    return neuralNetNodeList;
  }

  public void setNeuralNetNodeList(List<NeuralNetNode> neuralNetNodeList) {
    this.neuralNetNodeList = neuralNetNodeList;
  }

  public List<NeuralNetEdge> getNeuralNetEdgeList() {
    return neuralNetEdgeList;
  }

  public void setNeuralNetEdgeList(List<NeuralNetEdge> neuralNetEdgeList) {
    this.neuralNetEdgeList = neuralNetEdgeList;
  }

  public List<NeuralNetLayer> getNeuralNetLayerList() {
    return neuralNetLayerList;
  }

  public void setNeuralNetLayerList(List<NeuralNetLayer> neuralNetLayerList) {
    this.neuralNetLayerList = neuralNetLayerList;
  }

  @Override
  public String toString() {
    return "NeuralNetGraph{" +
        "neuralNetNodeList=" + neuralNetNodeList +
        ", neuralNetEdgeList=" + neuralNetEdgeList +
        ", neuralNetLayerList=" + neuralNetLayerList +
        '}';
  }
}
