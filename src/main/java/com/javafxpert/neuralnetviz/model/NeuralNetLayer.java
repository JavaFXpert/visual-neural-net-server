package com.javafxpert.neuralnetviz.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jamesweaver on 7/13/16.
 */
public class NeuralNetLayer {
  private int layerNum;
  private List<NeuralNetNode> neuralNetNodeList = new ArrayList<>();
  private List<NeuralNetEdge> neuralNetEdgeList = new ArrayList<>();
}
