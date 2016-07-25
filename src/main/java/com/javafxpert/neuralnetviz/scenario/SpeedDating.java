package com.javafxpert.neuralnetviz.scenario;

import com.javafxpert.neuralnetviz.model.ModelListener;
import com.javafxpert.neuralnetviz.model.MultiLayerNetworkEnhanced;
import org.canova.api.records.reader.RecordReader;
import org.canova.api.records.reader.impl.CSVRecordReader;
import org.canova.api.split.FileSplit;
import org.datavec.api.util.ClassPathResource;
import org.deeplearning4j.datasets.canova.RecordReaderDataSetIterator;
import org.nd4j.linalg.dataset.SplitTestAndTrain;
import org.nd4j.linalg.dataset.api.iterator.DataSetIterator;
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
import org.nd4j.linalg.dataset.api.preprocessor.DataNormalization;
import org.nd4j.linalg.dataset.api.preprocessor.NormalizerStandardize;
import org.nd4j.linalg.factory.Nd4j;
import org.nd4j.linalg.lossfunctions.LossFunctions;
import org.nd4j.linalg.lossfunctions.LossFunctions.LossFunction;
import org.springframework.web.socket.WebSocketSession;

import java.io.File;

//import org.deeplearning4j.ui.weights.HistogramIterationListener;

/**
 * @author Adam Gibson
 */
public class SpeedDating {

    public static MultiLayerNetworkEnhanced buildNetwork(WebSocketSession webSocketSession) throws  Exception {

        //First: get the dataset using the record reader. CSVRecordReader handles loading/parsing
        int numLinesToSkip = 0;
        String delimiter = ",";
        org.datavec.api.records.reader.RecordReader recordReader = new org.datavec.api.records.reader.impl.csv.CSVRecordReader(numLinesToSkip,delimiter);
        recordReader.initialize(new org.datavec.api.split.FileSplit(new File("src/main/resources/classification/speed_dating_all.csv")));

        //Second: the RecordReaderDataSetIterator handles conversion to DataSet objects, ready for use in neural network
        int labelIndex = 0;     //5 values in each row of the iris.txt CSV: 4 input features followed by an integer label (class) index. Labels are the 5th value (index 4) in each row
        int numClasses = 2;     //3 classes (types of iris flowers) in the iris data set. Classes have integer values 0, 1 or 2
        int batchSize = 8378;    //Iris data set: 150 examples total. We are loading all of them into one DataSet (not recommended for large data sets)

        DataSetIterator iterator = new org.deeplearning4j.datasets.datavec.RecordReaderDataSetIterator(recordReader,batchSize,labelIndex,numClasses);
        DataSet allData = iterator.next();
        allData.shuffle();
        SplitTestAndTrain testAndTrain = allData.splitTestAndTrain(0.65);  //Use 65% of data for training

        DataSet trainingData = testAndTrain.getTrain();
        DataSet testData = testAndTrain.getTest();

        //We need to normalize our data. We'll use NormalizeStandardize (which gives us mean 0, unit variance):
        DataNormalization normalizer = new NormalizerStandardize();
        normalizer.fit(trainingData);           //Collect the statistics (mean/stdev) from the training data. This does not modify the input data
        normalizer.transform(trainingData);     //Apply normalization to the training data
        normalizer.transform(testData);         //Apply normalization to the test data. This is using statistics calculated from the *training* set


        final int numInputs = 3;
        int outputNum = 2;
        int iterations = 300;
        long seed = 6;

        MultiLayerConfiguration conf = new NeuralNetConfiguration.Builder()
            .seed(seed)
            .iterations(iterations)
            .activation("tanh")
            .weightInit(WeightInit.XAVIER)
            .learningRate(0.1)
            .regularization(true).l2(1e-4)
            .list()
            .layer(0, new DenseLayer.Builder().nIn(numInputs).nOut(5)
                .build())
            //.layer(1, new DenseLayer.Builder().nIn(3).nOut(3)
            //    .build())
            .layer(1, new OutputLayer.Builder(LossFunctions.LossFunction.NEGATIVELOGLIKELIHOOD)
                .activation("softmax")
                .nIn(5).nOut(outputNum).build())
            .backprop(true).pretrain(false)
            .build();

        String[] inputFeatureNames = {"Attractive (1-10)", "Intelligent (1-10)", "Fun (1-10)"};
        String[] outputLabelNames = {"No second date", "Date again"};
        MultiLayerNetworkEnhanced model = new MultiLayerNetworkEnhanced(conf, inputFeatureNames, outputLabelNames);
        model.init();
        //model.setListeners(new ScoreIterationListener(100));    //Print score every 100 parameter updates
        model.setListeners(new ModelListener(10, webSocketSession), new ScoreIterationListener(10));
        model.setDataNormalization(normalizer);

        model.fit( trainingData );

        //evaluate the model on the test set
        Evaluation eval = new Evaluation(outputNum);
        INDArray output = model.output(testData.getFeatureMatrix());
        eval.eval(testData.getLabels(), output);
        System.out.println(eval.stats());


        // Make prediction
        // Input: 7, 8, 9  Expected output: ?
        INDArray example = Nd4j.zeros(1, 3);
        example.putScalar(new int[] { 0, 0 }, 7);
        example.putScalar(new int[] { 0, 1 }, 8);
        example.putScalar(new int[] { 0, 2 }, 9);
        DataSet ds = new DataSet(example, null);
        normalizer.transform(ds);
        int[] prediction = model.predict(example);
        System.out.println("prediction for 7 (attractive), 8 (intelligent), 9 (fun): " + prediction[0]);

        System.out.println("****************Example finished********************");

        return model;
    }

}

