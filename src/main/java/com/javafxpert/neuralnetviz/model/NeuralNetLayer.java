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
