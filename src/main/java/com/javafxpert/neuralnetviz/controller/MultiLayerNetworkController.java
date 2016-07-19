package com.javafxpert.neuralnetviz.controller;

import com.javafxpert.neuralnetviz.model.multilayernetwork.PredictionResponse;
import com.javafxpert.neuralnetviz.state.MultiLayerNetworkState;
import com.javafxpert.neuralnetviz.util.AppUtils;
import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.factory.Nd4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

/**
 * Created by jamesweaver on 7/18/16.
 */
@RestController
public class MultiLayerNetworkController {
  // The values parameter takes a comma separated list of numbers representing feature values
  @RequestMapping(value = "/prediction", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Object> renderClaims(@RequestParam(value = "values")
                                             String values) {

    PredictionResponse predictionResponse = null;

    double[] valuesArray = AppUtils.commaSeparatedNumbersToArray(values);
    int numValues = valuesArray.length;

    // Retrieve the model state
    MultiLayerNetwork network = MultiLayerNetworkState.getNeuralNetworkModel();

    int numInputColumns = network.getInput().columns();

    // Validate the number of values submitted into this service matches number of input values in the network
    if (numValues > 0 && numValues == numInputColumns) {

      // Make prediction
      // Input: 0.6236,-0.7822  Expected output: 1
      INDArray example = Nd4j.zeros(1, numValues);
      for (int valueIdx = 0; valueIdx < numValues; valueIdx++) {
        example.putScalar(new int[] { 0, valueIdx }, valuesArray[valueIdx]);
      }
      int[] prediction = network.predict(example);
      System.out.println("prediction: " + prediction[0]);

      predictionResponse = new PredictionResponse(prediction[0]);
    }

    return Optional.ofNullable(predictionResponse)
        .map(cr -> new ResponseEntity<>((Object)cr, HttpStatus.OK))
        .orElse(new ResponseEntity<>("Prediction unsuccessful", HttpStatus.INTERNAL_SERVER_ERROR));
  }
}
