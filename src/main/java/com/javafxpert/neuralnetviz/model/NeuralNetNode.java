package com.javafxpert.neuralnetviz.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"id", "label", "image"})

/**
 * Created by jamesweaver on 7/12/16.
 */
public class NeuralNetNode {
  @JsonProperty("id")
  private String id;  // Node ID

  @JsonProperty("label")
  private String bias;

  @JsonProperty("image")
  private String image;

  @JsonProperty("name")
  private String name;

  public NeuralNetNode() {
    this.bias = "";
  }

  public NeuralNetNode(String id, String bias, String image, String name) {
    this.id = id;
    this.bias = bias;
    this.image = image;
    this.name = name;
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

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Override
  public String toString() {
    return "NeuralNetNode{" +
        "id='" + id + '\'' +
        ", bias='" + bias + '\'' +
        ", image='" + image + '\'' +
        ", name='" + name + '\'' +
        '}';
  }
}
