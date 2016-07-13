package com.javafxpert.neuralnetviz.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jamesweaver on 7/13/16.
 */
public class NeuralNetLayer {
  private int layerNum;
  private List<NeuralNetNode> neuralNetNodeList = new ArrayList<>();

  public NeuralNetLayer() {
  }

  public NeuralNetLayer(int layerNum, List<NeuralNetNode> neuralNetNodeList) {
    this.layerNum = layerNum;
    this.neuralNetNodeList = neuralNetNodeList;
  }

  public int getLayerNum() {
    return layerNum;
  }

  public void setLayerNum(int layerNum) {
    this.layerNum = layerNum;
  }

  public List<NeuralNetNode> getNeuralNetNodeList() {
    return neuralNetNodeList;
  }

  public void setNeuralNetNodeList(List<NeuralNetNode> neuralNetNodeList) {
    this.neuralNetNodeList = neuralNetNodeList;
  }

  @Override
  public String toString() {
    return "NeuralNetLayer{" +
        "layerNum=" + layerNum +
        ", neuralNetNodeList=" + neuralNetNodeList +
        '}';
  }
}
