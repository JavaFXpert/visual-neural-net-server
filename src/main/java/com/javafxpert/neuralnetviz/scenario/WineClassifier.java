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
import org.datavec.api.records.reader.RecordReader;
import org.datavec.api.records.reader.impl.csv.CSVRecordReader;
import org.datavec.api.split.FileSplit;
import org.datavec.api.util.ClassPathResource;
import org.deeplearning4j.datasets.datavec.RecordReaderDataSetIterator;
import org.deeplearning4j.eval.Evaluation;
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
import org.nd4j.linalg.dataset.SplitTestAndTrain;
import org.nd4j.linalg.lossfunctions.LossFunctions.LossFunction;
import org.nd4j.linalg.dataset.api.iterator.DataSetIterator;
import org.nd4j.linalg.dataset.api.preprocessor.DataNormalization;
import org.nd4j.linalg.dataset.api.preprocessor.NormalizerStandardize;
import org.springframework.web.socket.WebSocketSession;

import java.io.File;

public class WineClassifier {
    public final static int SEED = 123; // Constant seed to ensure results on all runs are the same
    public final static int EPOCHS = 30;
    public final static int ITERATIONS = 20; // Number of iterations per epoch

    public final static double EPSILON = 0.05; // Learning Rate. a 5% epsilon on the error derivative
    private static final double ALPHA = 0.1;   // Momentum Value. 10% alpha on previous error delta.

    public final static int FILE_SIZE = 178; // Load all the records
    public final static int CLASS_INDEX=0;

    public final static int INPUT_NEURONS = 13;
    public final static int NUM_OF_CLASSES = 3;
    public final static int HIDDEN_NEURONS = 6;
    public final static int OUTPUT_NEURONS = NUM_OF_CLASSES;

    public final static double DATA_SPLIT_TRAIN_TEST = 0.65; //Use 65% of data for training, remaining for validation

    private static final String HIDDEN_LAYER_ACTIVATION = "relu";
    private static final String OUTPUT_LAYER_ACTIVATION = "softmax";

    public static MultiLayerNetworkEnhanced buildNetwork(WebSocketSession webSocketSession) throws  Exception {
        //Load the training data:
        RecordReader rr = new CSVRecordReader();
        rr.initialize(new FileSplit((new File("src/main/resources/classification/wine.data"))));

        DataSetIterator iterator = new RecordReaderDataSetIterator(rr,FILE_SIZE,CLASS_INDEX,NUM_OF_CLASSES);
        DataSet wineData = iterator.next();
        wineData.shuffle();
        SplitTestAndTrain testAndTrain = wineData.splitTestAndTrain(DATA_SPLIT_TRAIN_TEST);
        DataSet trainingData = testAndTrain.getTrain();
        DataSet testData = testAndTrain.getTest();

        // A Standard Normalizer which gives zero-mean, unit variance
        DataNormalization normalizer = new NormalizerStandardize();
        normalizer.fit(trainingData);           // Collect the statistics (mean/stdev) from the training data. This does not modify the input data
        normalizer.transform(trainingData);     // Apply normalization to the training data
        normalizer.transform(testData);         // Apply normalization to the test data. This is using statistics calculated from the *training* set

        MultiLayerConfiguration conf = new NeuralNetConfiguration.Builder()
            .seed(SEED)
            .iterations(ITERATIONS)
            .weightInit(WeightInit.RELU)
            .optimizationAlgo(OptimizationAlgorithm.STOCHASTIC_GRADIENT_DESCENT)
            .learningRate(EPSILON)
            .regularization(true).l2(1e-4)
            .updater(Updater.NESTEROVS).momentum(ALPHA)
            .list()
            .layer(0, new DenseLayer.Builder()
                .nIn(INPUT_NEURONS).nOut(HIDDEN_NEURONS).activation(HIDDEN_LAYER_ACTIVATION).build())
            .layer(1, new OutputLayer.Builder(LossFunction.NEGATIVELOGLIKELIHOOD)
                .nIn(HIDDEN_NEURONS).nOut(OUTPUT_NEURONS).activation(OUTPUT_LAYER_ACTIVATION).build())
            .pretrain(false).backprop(true).build();

        String[] inputFeatureNames = {"Alcohol (11.0-14.9)", "Malic acid (0.7-5.8)", "Ash (1.3-3.3)", "Alcalinity of ash (10.6-30.0)",
            "Magnesium (70-162)", "Total phenols (0.9-3.9)", "Flavanoids (0.30-5.1)", "Nonflavanoid phenols (0.1-0.7)",
            "Proanthocyanins (0.4-3.6)", "Color intensity (1.2-13.0)", "Hue (0.4-1.8)",
            "OD280/OD315 of diluted (1.2-4.0)", "Proline (278-1680)"};
        String[] outputLabelNames = {"Cultivar A", "Cultivar B", "Cultivar C"};
        MultiLayerNetworkEnhanced networkModel = new MultiLayerNetworkEnhanced(conf, inputFeatureNames, outputLabelNames);
        networkModel.init();
        //model.setListeners(new ScoreIterationListener(100));    //Print score every 100 parameter updates
        networkModel.setListeners(new ModelListener(10, webSocketSession));
        networkModel.setDataNormalization(normalizer);

        for ( int n = 0; n < EPOCHS; n++) {
            networkModel.fit(trainingData);
        }

        System.out.println("Evaluate model....");
        Evaluation eval = new Evaluation(OUTPUT_NEURONS);
        INDArray output = networkModel.output(testData.getFeatureMatrix());

        System.out.println(testData.getFeatureMatrix());
        System.out.println(output);

        eval.eval(testData.getLabels(), output);

        //Print the evaluation statistics
        System.out.println(eval.stats());

        return networkModel;

    }
}
