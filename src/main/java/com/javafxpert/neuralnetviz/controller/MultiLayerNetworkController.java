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
package com.javafxpert.neuralnetviz.controller;

import com.javafxpert.neuralnetviz.model.MultiLayerNetworkEnhanced;
import com.javafxpert.neuralnetviz.model.multilayernetwork.PredictionResponse;
import com.javafxpert.neuralnetviz.state.MultiLayerNetworkState;
import com.javafxpert.neuralnetviz.util.AppUtils;
import org.deeplearning4j.nn.api.Layer;
import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.dataset.DataSet;
import org.nd4j.linalg.dataset.api.preprocessor.DataNormalization;
import org.nd4j.linalg.dataset.api.preprocessor.NormalizerStandardize;
import org.nd4j.linalg.factory.Nd4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Created by jamesweaver on 7/18/16.
 */
@RestController
public class MultiLayerNetworkController {
  // The values parameter takes a comma separated list of numbers representing feature values
  @CrossOrigin(origins = "http://localhost:4200")
  @RequestMapping(value = "/prediction", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Object> renderPrediction(@RequestParam(value = "values")
                                             String values) {

    PredictionResponse predictionResponse = null;

    double[] valuesArray = AppUtils.commaSeparatedNumbersToArray(values);
    int numValues = valuesArray.length;

    // Retrieve the model state
    MultiLayerNetwork network = MultiLayerNetworkState.getNeuralNetworkModel();

    int numInputColumns = network.getInput().columns();

    // Validate the number of values submitted into this service matches number of input values in the network
    if (numValues > 0 && numValues == numInputColumns) {

      predictionResponse = new PredictionResponse();

      // Make prediction
      // Input: 0.6236,-0.7822  Expected output: 1
      INDArray features = Nd4j.zeros(1, numValues);
      for (int valueIdx = 0; valueIdx < numValues; valueIdx++) {
        features.putScalar(new int[] { 0, valueIdx }, valuesArray[valueIdx]);
      }
      predictionResponse = predict(features);
    }

    return Optional.ofNullable(predictionResponse)
        .map(cr -> new ResponseEntity<>((Object)cr, HttpStatus.OK))
        .orElse(new ResponseEntity<>("Prediction unsuccessful", HttpStatus.INTERNAL_SERVER_ERROR));
  }

  /**
   * Modification of predict() method in dl4j library for the purpose of retrieving activation at prediction time
   * @param featuresMatrix
   * @return PredictionResponse
   */
  public PredictionResponse predict(INDArray featuresMatrix) {
    PredictionResponse retVal = new PredictionResponse();
    MultiLayerNetworkEnhanced network = MultiLayerNetworkState.getNeuralNetworkModel();

    // Normalize the featureMatrix input if example data was normalized
    boolean exampleDataNormalized = network.getDataNormalization() != null;
    if (exampleDataNormalized) {
      DataNormalization normalizer = network.getDataNormalization();
      DataSet ds = new DataSet(featuresMatrix, null);
      normalizer.transform(ds);
    }
    retVal.setInputsNormalized(exampleDataNormalized);

    INDArray output = network.output(featuresMatrix, false);

    List<INDArray> layerActivationsList = network.feedForward(featuresMatrix);
    for (INDArray layerActivations : layerActivationsList) {
      for (int activationIdx = 0; activationIdx < layerActivations.length(); activationIdx++) {
        double activation = Math.round(layerActivations.getDouble(activationIdx) * 100) / 100d;
        retVal.getActivations().add(new Double(activation));
      }
    }

    int[] prediction = new int[featuresMatrix.size(0)];
    if (featuresMatrix.isRowVector()) prediction[0] = Nd4j.getBlasWrapper().iamax(output);
    else {
      for (int i = 0; i < prediction.length; i++)
        prediction[i] = Nd4j.getBlasWrapper().iamax(output.getRow(i));
    }
    retVal.setPrediction(prediction[0]);

    retVal.setNumOutputNodes(network.getOutputLabelNames().length);
    return retVal;
  }


}
