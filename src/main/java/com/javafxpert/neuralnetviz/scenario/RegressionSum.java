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
package com.javafxpert.neuralnetviz.scenario;

import com.javafxpert.neuralnetviz.model.ModelListener;
import com.javafxpert.neuralnetviz.model.MultiLayerNetworkEnhanced;
import org.deeplearning4j.datasets.iterator.impl.ListDataSetIterator;
import org.deeplearning4j.nn.api.OptimizationAlgorithm;
import org.deeplearning4j.nn.conf.MultiLayerConfiguration;
import org.deeplearning4j.nn.conf.NeuralNetConfiguration;
import org.deeplearning4j.nn.conf.Updater;
import org.deeplearning4j.nn.conf.layers.DenseLayer;
import org.deeplearning4j.nn.conf.layers.OutputLayer;
import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;
import org.deeplearning4j.nn.weights.WeightInit;
import org.deeplearning4j.optimize.listeners.ScoreIterationListener;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.dataset.DataSet;
import org.nd4j.linalg.dataset.api.iterator.DataSetIterator;
import org.nd4j.linalg.factory.Nd4j;
import org.nd4j.linalg.lossfunctions.LossFunctions;
import org.springframework.web.socket.WebSocketSession;

import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * Created by Anwar on 3/15/2016.
 * An example of regression neural network for performing addition
 */
public class RegressionSum {
    //Random number generator seed, for reproducability
    public static final int seed = 12345;
    //Number of iterations per minibatch
    public static final int iterations = 1;
    //Number of epochs (full passes of the data)
    public static final int nEpochs = 200;
    //Number of data points
    public static final int nSamples = 3000;
    //Batch size: i.e., each epoch has nSamples/batchSize parameter updates
    public static final int batchSize = 100;
    //Network learning rate
    public static final double learningRate = 0.01;
    // The range of the sample data, data in range (0-1 is sensitive for NN, you can try other ranges and see how it effects the results
    // also try changing the range along with changing the activation function
    public static int MIN_RANGE = 0;
    public static int MAX_RANGE = 3;

    public static final Random rng = new Random(seed);

    public static MultiLayerNetworkEnhanced buildNetwork(WebSocketSession webSocketSession) throws  Exception {

        //Generate the training data
        DataSetIterator iterator = getTrainingData(batchSize,rng);

        //Create the network
        int numInput = 2;
        int numOutputs = 1;
        int nHidden = 10;
        MultiLayerConfiguration conf = new  NeuralNetConfiguration.Builder()
                .seed(seed)
                .iterations(iterations)
                .optimizationAlgo(OptimizationAlgorithm.STOCHASTIC_GRADIENT_DESCENT)
                .learningRate(learningRate)
                .weightInit(WeightInit.XAVIER)
                .updater(Updater.NESTEROVS).momentum(0.9)
                .list()
                .layer(0, new DenseLayer.Builder().nIn(numInput).nOut(nHidden)
                        .activation("tanh")
                        .build())
                .layer(1, new OutputLayer.Builder(LossFunctions.LossFunction.MSE)
                        .activation("identity")
                        .nIn(nHidden).nOut(numOutputs).build())
                .pretrain(false).backprop(true).build();

        String[] inputFeatureNames = {"operand (0-3)", "operand (0-3)"};
        String[] outputLabelNames = {"sum"};
        MultiLayerNetworkEnhanced net = new MultiLayerNetworkEnhanced(conf, inputFeatureNames, outputLabelNames);
        //model.setDataNormalization(normalizer);

        net.init();
        //model.setListeners(new ScoreIterationListener(100));
        net.setListeners(new ModelListener(100, webSocketSession));


        //Train the network on the full data set, and evaluate in periodically
        for( int i=0; i<nEpochs; i++ ){
            iterator.reset();
            net.fit(iterator);
        }
        // Test the addition of 2 numbers (Try different numbers here)
        final INDArray input = Nd4j.create(new double[] { 0.111111, 0.3333333333333 }, new int[] { 1, 2 });
        INDArray out = net.output(input, false);
        System.out.println(out);

        return net;
    }

    private static DataSetIterator getTrainingData(int batchSize, Random rand){
        double [] sum = new double[nSamples];
        double [] input1 = new double[nSamples];
        double [] input2 = new double[nSamples];
        for (int i= 0; i< nSamples; i++) {
            input1[i] = (MIN_RANGE + (MAX_RANGE - MIN_RANGE) * rand.nextDouble());
            input2[i] = (MIN_RANGE + (MAX_RANGE - MIN_RANGE) * rand.nextDouble());
            sum[i] = input1[i] + input2[i];
        }
        INDArray inputNDArray1 = Nd4j.create(input1, new int[]{nSamples,1});
        INDArray inputNDArray2 = Nd4j.create(input2, new int[]{nSamples,1});
        INDArray inputNDArray = Nd4j.hstack(inputNDArray1,inputNDArray2);
        INDArray outPut = Nd4j.create(sum, new int[]{nSamples, 1});
        DataSet dataSet = new DataSet(inputNDArray, outPut);
        List<DataSet> listDs = dataSet.asList();
        Collections.shuffle(listDs,rng);
        return new ListDataSetIterator(listDs,batchSize);

    }
}
