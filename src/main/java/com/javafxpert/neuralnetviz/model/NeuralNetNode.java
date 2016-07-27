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

  @JsonProperty("actFunc")
  private String activationFunction;

  @JsonProperty("name")
  private String name;

  public NeuralNetNode() {
    this.bias = "";
  }

  public NeuralNetNode(String id, String bias, String image, String activationFunction, String name) {
    this.id = id;
    this.bias = bias;
    this.image = image;
    this.activationFunction = activationFunction;
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

  public String getActivationFunction() {
    return activationFunction;
  }

  public void setActivationFunction(String activationFunction) {
    this.activationFunction = activationFunction;
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
        ", activationFunction='" + activationFunction + '\'' +
        ", name='" + name + '\'' +
        '}';
  }
}
