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
import org.datavec.api.records.reader.SequenceRecordReader;
import org.datavec.api.records.reader.impl.csv.CSVSequenceRecordReader;
import org.datavec.api.split.NumberedFileInputSplit;
import org.deeplearning4j.datasets.datavec.SequenceRecordReaderDataSetIterator;
import org.deeplearning4j.eval.Evaluation;
import org.deeplearning4j.nn.api.OptimizationAlgorithm;
import org.deeplearning4j.nn.conf.BackpropType;
import org.deeplearning4j.nn.conf.MultiLayerConfiguration;
import org.deeplearning4j.nn.conf.NeuralNetConfiguration;
import org.deeplearning4j.nn.conf.Updater;
import org.deeplearning4j.nn.conf.layers.DenseLayer;
import org.deeplearning4j.nn.conf.layers.GravesLSTM;
import org.deeplearning4j.nn.conf.layers.OutputLayer;
import org.deeplearning4j.nn.conf.layers.RnnOutputLayer;
import org.deeplearning4j.nn.weights.WeightInit;
import org.deeplearning4j.optimize.listeners.ScoreIterationListener;
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
import java.util.List;

//import org.deeplearning4j.ui.weights.HistogramIterationListener;

/**
 * @author James Weaver
 */
public class PebbleGestures {

    //public static MultiLayerNetworkEnhanced buildNetwork(WebSocketSession webSocketSession) throws  Exception {
    public static void main(String[] args) throws  Exception {

        //First: get the dataset using the record reader. CSVRecordReader handles loading/parsing
        int numLinesToSkip = 0;
        String delimiter = ",";
        int miniBatchSize = 10;
        int numPossibleLabels = 3;
        int labelIndex = 3;
        boolean regression = false;
        final int numInputs = 3;
        int iterations = 600;
        long seed = 6;
        double learningRate = 0.003;
        int lstmLayerSize = 20;					//Number of units in each GravesLSTM layer


        SequenceRecordReader reader = new CSVSequenceRecordReader(0, ",");
        reader.initialize(new NumberedFileInputSplit("src/main/resources/classification/pebble_data_%d.csv", 0, 2));
        DataSetIterator variableLengthIter = new SequenceRecordReaderDataSetIterator(reader, miniBatchSize, numPossibleLabels, labelIndex, regression);

        //org.datavec.api.records.reader.RecordReader recordReader = new org.datavec.api.records.reader.impl.csv.CSVRecordReader(numLinesToSkip,delimiter);
        //recordReader.initialize(new org.datavec.api.split.FileSplit(new File("src/main/resources/classification/speed_dating_all.csv")));

        DataSet allData = variableLengthIter.next();
        //SplitTestAndTrain testAndTrain = allData.splitTestAndTrain(0.99);  //Use 65% of data for training

        //DataSet trainingData = testAndTrain.getTrain();
        //DataSet testData = testAndTrain.getTest();

        //We need to normalize our data. We'll use NormalizeStandardize (which gives us mean 0, unit variance):
        DataNormalization normalizer = new NormalizerStandardize();
        normalizer.fit(allData);           //Collect the statistics (mean/stdev) from the training data. This does not modify the input data
        normalizer.transform(allData);     //Apply normalization to the training data
        //normalizer.transform(testData);         //Apply normalization to the test data. This is using statistics calculated from the *training* set

        //Set up network configuration:
        MultiLayerConfiguration conf = new NeuralNetConfiguration.Builder()
            .optimizationAlgo(OptimizationAlgorithm.STOCHASTIC_GRADIENT_DESCENT).iterations(iterations)
            .learningRate(learningRate)
            .rmsDecay(0.95)
            .seed(12345)
            .regularization(true)
            .l2(0.001)
            .weightInit(WeightInit.XAVIER)
            .updater(Updater.RMSPROP)
            .list()
            .layer(0, new GravesLSTM.Builder().nIn(numInputs).nOut(lstmLayerSize)
                .activation("tanh").build())
            .layer(1, new GravesLSTM.Builder().nIn(lstmLayerSize).nOut(lstmLayerSize)
                .activation("tanh").build())
            .layer(2, new RnnOutputLayer.Builder(LossFunction.MCXENT).activation("softmax")        //MCXENT + softmax for classification
                .nIn(lstmLayerSize).nOut(numPossibleLabels).build())
            //.backpropType(BackpropType.TruncatedBPTT).tBPTTForwardLength(tbpttLength).tBPTTBackwardLength(tbpttLength)
            .pretrain(false).backprop(true)
            .build();


        String[] inputFeatureNames = {"accel x", "accel y", "accel z"};
        String[] outputLabelNames = {"Subject A", "Subject B", "Subject C"};
        MultiLayerNetworkEnhanced model = new MultiLayerNetworkEnhanced(conf, inputFeatureNames, outputLabelNames);
        model.init();
        model.setListeners(new ScoreIterationListener(1));    //Print score every 1 parameter updates
        //model.setListeners(new ModelListener(10, webSocketSession));
        model.setDataNormalization(normalizer);

        model.fit( allData );

        //evaluate the model on the test set
        /*
        Evaluation eval = new Evaluation(numPossibleLabels);
        INDArray output = model.output(testData.getFeatureMatrix());
        eval.eval(testData.getLabels(), output);
        System.out.println(eval.stats());
        */


        // Make prediction
        // Expected output: 0
        INDArray example = Nd4j.zeros(1, 3, 10);
        example.putScalar(new int[] { 0, 0, 0 }, 1895);
        example.putScalar(new int[] { 0, 1, 0 }, 2390);
        example.putScalar(new int[] { 0, 2, 0 }, 2024);
        example.putScalar(new int[] { 0, 0, 1 }, 1889);
        example.putScalar(new int[] { 0, 1, 1 }, 2389);
        example.putScalar(new int[] { 0, 2, 1 }, 2022);
        example.putScalar(new int[] { 0, 0, 2 }, 1886);
        example.putScalar(new int[] { 0, 1, 2 }, 2383);
        example.putScalar(new int[] { 0, 2, 2 }, 2027);
        example.putScalar(new int[] { 0, 0, 3 }, 1888);
        example.putScalar(new int[] { 0, 1, 3 }, 2382);
        example.putScalar(new int[] { 0, 2, 3 }, 2028);
        example.putScalar(new int[] { 0, 0, 4 }, 1889);
        example.putScalar(new int[] { 0, 1, 4 }, 2385);
        example.putScalar(new int[] { 0, 2, 4 }, 2027);
        example.putScalar(new int[] { 0, 0, 5 }, 1892);
        example.putScalar(new int[] { 0, 1, 5 }, 2386);
        example.putScalar(new int[] { 0, 2, 5 }, 2023);
        example.putScalar(new int[] { 0, 0, 6 }, 1893);
        example.putScalar(new int[] { 0, 1, 6 }, 2381);
        example.putScalar(new int[] { 0, 2, 6 }, 2020);
        example.putScalar(new int[] { 0, 0, 7 }, 1897);
        example.putScalar(new int[] { 0, 1, 7 }, 2388);
        example.putScalar(new int[] { 0, 2, 7 }, 2030);
        example.putScalar(new int[] { 0, 0, 8 }, 1893);
        example.putScalar(new int[] { 0, 1, 8 }, 2384);
        example.putScalar(new int[] { 0, 2, 8 }, 2027);
        example.putScalar(new int[] { 0, 0, 9 }, 1894);
        example.putScalar(new int[] { 0, 1, 9 }, 2387);
        example.putScalar(new int[] { 0, 2, 9 }, 2030);
        DataSet ds = new DataSet(example, null);
        normalizer.transform(ds);
        model.rnnClearPreviousState();
        INDArray outputActivations = model.rnnTimeStep(example);
        System.out.println("outputActivations expected 0: " + outputActivations);

        // Make prediction
        // Expected output: 1
        example = Nd4j.zeros(1, 3, 10);
        example.putScalar(new int[] { 0, 0, 0 }, 2121);
        example.putScalar(new int[] { 0, 1, 0 }, 2349);
        example.putScalar(new int[] { 0, 2, 0 }, 1966);
        example.putScalar(new int[] { 0, 0, 1 }, 2124);
        example.putScalar(new int[] { 0, 1, 1 }, 2354);
        example.putScalar(new int[] { 0, 2, 1 }, 1966);
        example.putScalar(new int[] { 0, 0, 2 }, 2122);
        example.putScalar(new int[] { 0, 1, 2 }, 2357);
        example.putScalar(new int[] { 0, 2, 2 }, 1970);
        example.putScalar(new int[] { 0, 0, 3 }, 2122);
        example.putScalar(new int[] { 0, 1, 3 }, 2355);
        example.putScalar(new int[] { 0, 2, 3 }, 1966);
        example.putScalar(new int[] { 0, 0, 4 }, 2123);
        example.putScalar(new int[] { 0, 1, 4 }, 2347);
        example.putScalar(new int[] { 0, 2, 4 }, 1971);
        example.putScalar(new int[] { 0, 0, 5 }, 2123);
        example.putScalar(new int[] { 0, 1, 5 }, 2347);
        example.putScalar(new int[] { 0, 2, 5 }, 1967);
        example.putScalar(new int[] { 0, 0, 6 }, 2119);
        example.putScalar(new int[] { 0, 1, 6 }, 2354);
        example.putScalar(new int[] { 0, 2, 6 }, 1966);
        example.putScalar(new int[] { 0, 0, 7 }, 2114);
        example.putScalar(new int[] { 0, 1, 7 }, 2350);
        example.putScalar(new int[] { 0, 2, 7 }, 1963);
        example.putScalar(new int[] { 0, 0, 8 }, 2123);
        example.putScalar(new int[] { 0, 1, 8 }, 2351);
        example.putScalar(new int[] { 0, 2, 8 }, 1966);
        example.putScalar(new int[] { 0, 0, 9 }, 2126);
        example.putScalar(new int[] { 0, 1, 9 }, 2351);
        example.putScalar(new int[] { 0, 2, 9 }, 1963);
        ds = new DataSet(example, null);
        normalizer.transform(ds);
        model.rnnClearPreviousState();
        outputActivations = model.rnnTimeStep(example);
        System.out.println("outputActivations expected 1: " + outputActivations);

        // Make prediction
        // Expected output: 2
        example = Nd4j.zeros(1, 3, 10);
        example.putScalar(new int[] { 0, 0, 0 }, 1925);
        example.putScalar(new int[] { 0, 1, 0 }, 2386);
        example.putScalar(new int[] { 0, 2, 0 }, 1983);
        example.putScalar(new int[] { 0, 0, 1 }, 1925);
        example.putScalar(new int[] { 0, 1, 1 }, 2389);
        example.putScalar(new int[] { 0, 2, 1 }, 1983);
        example.putScalar(new int[] { 0, 0, 2 }, 1923);
        example.putScalar(new int[] { 0, 1, 2 }, 2393);
        example.putScalar(new int[] { 0, 2, 2 }, 1985);
        example.putScalar(new int[] { 0, 0, 3 }, 1918);
        example.putScalar(new int[] { 0, 1, 3 }, 2386);
        example.putScalar(new int[] { 0, 2, 3 }, 1980);
        example.putScalar(new int[] { 0, 0, 4 }, 1922);
        example.putScalar(new int[] { 0, 1, 4 }, 2393);
        example.putScalar(new int[] { 0, 2, 4 }, 1978);
        example.putScalar(new int[] { 0, 0, 5 }, 1918);
        example.putScalar(new int[] { 0, 1, 5 }, 2383);
        example.putScalar(new int[] { 0, 2, 5 }, 1987);
        example.putScalar(new int[] { 0, 0, 6 }, 1927);
        example.putScalar(new int[] { 0, 1, 6 }, 2385);
        example.putScalar(new int[] { 0, 2, 6 }, 1984);
        example.putScalar(new int[] { 0, 0, 7 }, 1927);
        example.putScalar(new int[] { 0, 1, 7 }, 2384);
        example.putScalar(new int[] { 0, 2, 7 }, 1986);
        example.putScalar(new int[] { 0, 0, 8 }, 1922);
        example.putScalar(new int[] { 0, 1, 8 }, 2391);
        example.putScalar(new int[] { 0, 2, 8 }, 1985);
        example.putScalar(new int[] { 0, 0, 9 }, 1919);
        example.putScalar(new int[] { 0, 1, 9 }, 2389);
        example.putScalar(new int[] { 0, 2, 9 }, 1986 );
        ds = new DataSet(example, null);
        normalizer.transform(ds);
        model.rnnClearPreviousState();
        outputActivations = model.rnnTimeStep(example);
        System.out.println("outputActivations expected 2: " + outputActivations);

        System.out.println("****************Example finished********************");

        //return model;
    }

}

