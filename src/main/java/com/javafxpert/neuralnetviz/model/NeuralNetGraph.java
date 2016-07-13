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
