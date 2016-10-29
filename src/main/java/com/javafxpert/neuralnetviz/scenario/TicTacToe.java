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
import org.deeplearning4j.eval.Evaluation;
import org.deeplearning4j.nn.api.OptimizationAlgorithm;
import org.deeplearning4j.nn.conf.MultiLayerConfiguration;
import org.deeplearning4j.nn.conf.NeuralNetConfiguration;
import org.deeplearning4j.nn.conf.distribution.UniformDistribution;
import org.deeplearning4j.nn.conf.layers.DenseLayer;
import org.deeplearning4j.nn.conf.layers.OutputLayer;
import org.deeplearning4j.nn.weights.WeightInit;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.dataset.DataSet;
import org.nd4j.linalg.dataset.SplitTestAndTrain;
import org.nd4j.linalg.dataset.api.iterator.DataSetIterator;
import org.nd4j.linalg.dataset.api.preprocessor.DataNormalization;
import org.nd4j.linalg.dataset.api.preprocessor.NormalizerStandardize;
import org.nd4j.linalg.factory.Nd4j;
import org.nd4j.linalg.lossfunctions.LossFunctions.LossFunction;
import org.springframework.web.socket.WebSocketSession;

import java.io.File;

//import org.deeplearning4j.ui.weights.HistogramIterationListener;

/**
 * @author James L. Weaver
 */
public class TicTacToe {

    public static MultiLayerNetworkEnhanced buildNetwork(WebSocketSession webSocketSession) throws  Exception {

        //First: get the dataset using the record reader. CSVRecordReader handles loading/parsing
        int numLinesToSkip = 0;
        String delimiter = ",";
        org.datavec.api.records.reader.RecordReader recordReader = new org.datavec.api.records.reader.impl.csv.CSVRecordReader(numLinesToSkip,delimiter);
        recordReader.initialize(new org.datavec.api.split.FileSplit(new File("src/main/resources/classification/tic_tac_toe_all.csv")));

        //Second: the RecordReaderDataSetIterator handles conversion to DataSet objects, ready for use in neural network
        int labelIndex = 0;     // 28 values in each row of the dataset:  Labels are the 1st value (index 0) in each row
        int numClasses = 9;     //9 classes (a move for X in each square) in the data set. Classes have integer values 0 - 8

        //TODO: Ascertain best batch size for large datasets
        int batchSize = 145;    //Data set: ??? examples total. We are loading all of them into one DataSet (not recommended for large data sets)

        DataSetIterator iterator = new org.deeplearning4j.datasets.datavec.RecordReaderDataSetIterator(recordReader,batchSize,labelIndex,numClasses);
        DataSet allData = iterator.next();
        allData.shuffle();
        //SplitTestAndTrain testAndTrain = allData.splitTestAndTrain(0.50);  //Use 75% of data for training

        //DataSet trainingData = testAndTrain.getTrain();
        //DataSet testData = testAndTrain.getTest();

        //We need to normalize our data. We'll use NormalizeStandardize (which gives us mean 0, unit variance):
        //DataNormalization normalizer = new NormalizerStandardize();
        //normalizer.fit(allData);           //Collect the statistics (mean/stdev) from the training data. This does not modify the input data
        //normalizer.transform(allData);     //Apply normalization to the training data
        //normalizer.transform(testData);         //Apply normalization to the test data. This is using statistics calculated from the *training* set


        final int numInputs = 27;
        int outputNum = 9;
        int iterations = 10000;
        long seed = 6;

        MultiLayerConfiguration conf = new NeuralNetConfiguration.Builder()
            .seed(seed)
            .iterations(iterations)
            .activation("tanh")
            .weightInit(WeightInit.XAVIER)
            .learningRate(0.2)
            .useDropConnect(false)
            .optimizationAlgo(OptimizationAlgorithm.STOCHASTIC_GRADIENT_DESCENT)
            .biasInit(0)
            .regularization(true).l2(1e-4)
            .list()
            .layer(0, new DenseLayer.Builder().nIn(numInputs).nOut(9)
                .weightInit(WeightInit.DISTRIBUTION)
                .activation("sigmoid")
                .build())
            .layer(1, new OutputLayer.Builder(LossFunction.NEGATIVELOGLIKELIHOOD)
                .activation("softmax")
                .nIn(9).nOut(outputNum).build())
            .backprop(true).pretrain(false)
            .build();

        String[] inputFeatureNames = {"a:_", "a: X", "a: O", "b:_", "b: X", "b: O", "c:_", "c: X", "c: O",
                                      "d:_", "d: X", "d: O", "e:_", "e: X", "e: O", "f:_", "f: X", "f: O",
                                      "g:_", "g: X", "g: O", "h:_", "h: X", "h: O", "i:_", "i: X", "i: O"};
        String[] outputLabelNames = {"cell a", "cell b", "cell c", "cell d", "cell e", "cell f", "cell g", "cell h", "cell i"};
        MultiLayerNetworkEnhanced model = new MultiLayerNetworkEnhanced(conf, inputFeatureNames, outputLabelNames);
        model.init();
        //model.setListeners(new ScoreIterationListener(100));    //Print score every 100 parameter updates
        model.setListeners(new ModelListener(500, webSocketSession));
        //model.setDataNormalization(normalizer);

        model.fit( allData );

        //evaluate the model on the test set
        /*
        Evaluation eval = new Evaluation(outputNum);
        INDArray output = model.output(testData.getFeatureMatrix());
        eval.eval(testData.getLabels(), output);
        System.out.println(eval.stats());
        */


        // Make prediction
        // Input: 0,1,0, 1,0,0, 1,0,0, 1,0,0, 0,0,1, 1,0,0, 1,0,0, 1,0,0, 1,0,0  Expected output: 8
        INDArray example = Nd4j.zeros(1, 27);
        example.putScalar(new int[] { 0, 0 }, 0);
        example.putScalar(new int[] { 0, 1 }, 1);
        example.putScalar(new int[] { 0, 2 }, 0);
        example.putScalar(new int[] { 0, 3 }, 1);
        example.putScalar(new int[] { 0, 4 }, 0);
        example.putScalar(new int[] { 0, 5 }, 0);
        example.putScalar(new int[] { 0, 6 }, 1);
        example.putScalar(new int[] { 0, 7 }, 0);
        example.putScalar(new int[] { 0, 8 }, 0);
        example.putScalar(new int[] { 0, 9 }, 1);
        example.putScalar(new int[] { 0, 10 }, 0);
        example.putScalar(new int[] { 0, 11 }, 0);
        example.putScalar(new int[] { 0, 12 }, 0);
        example.putScalar(new int[] { 0, 13 }, 0);
        example.putScalar(new int[] { 0, 14 }, 1);
        example.putScalar(new int[] { 0, 15 }, 1);
        example.putScalar(new int[] { 0, 16 }, 0);
        example.putScalar(new int[] { 0, 17 }, 0);
        example.putScalar(new int[] { 0, 18 }, 1);
        example.putScalar(new int[] { 0, 19 }, 0);
        example.putScalar(new int[] { 0, 20 }, 0);
        example.putScalar(new int[] { 0, 21 }, 1);
        example.putScalar(new int[] { 0, 22 }, 0);
        example.putScalar(new int[] { 0, 23 }, 0);
        example.putScalar(new int[] { 0, 24 }, 1);
        example.putScalar(new int[] { 0, 25 }, 0);
        example.putScalar(new int[] { 0, 26 }, 0);
        DataSet ds = new DataSet(example, null);
        //normalizer.transform(ds);
        int[] prediction = model.predict(example);
        System.out.println("prediction for ???: " + prediction[0]);

        System.out.println("****************Example finished********************");

        return model;
    }

}

