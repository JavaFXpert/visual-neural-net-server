package com.javafxpert.neuralnetviz.scenario;

import com.javafxpert.neuralnetviz.model.ModelListener;
import com.javafxpert.neuralnetviz.model.MultiLayerNetworkEnhanced;
import org.canova.api.records.reader.RecordReader;
import org.canova.api.records.reader.impl.CSVRecordReader;
import org.canova.api.split.FileSplit;
import org.canova.api.split.InputStreamInputSplit;
import org.deeplearning4j.datasets.canova.RecordReaderDataSetIterator;
import org.deeplearning4j.eval.Evaluation;
import org.deeplearning4j.nn.api.Layer;
import org.deeplearning4j.nn.conf.MultiLayerConfiguration;
import org.deeplearning4j.nn.conf.NeuralNetConfiguration;
import org.deeplearning4j.nn.conf.layers.DenseLayer;
import org.deeplearning4j.nn.conf.layers.OutputLayer;
import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;
import org.deeplearning4j.nn.weights.WeightInit;
//import org.deeplearning4j.ui.weights.HistogramIterationListener;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.dataset.DataSet;
import org.nd4j.linalg.dataset.SplitTestAndTrain;
import org.nd4j.linalg.dataset.api.iterator.DataSetIterator;
import org.nd4j.linalg.factory.Nd4j;
import org.nd4j.linalg.lossfunctions.LossFunctions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.socket.WebSocketSession;

import java.net.URL;

/**
 * @author Adam Gibson
 */
public class CSVExample {

    private static Logger log = LoggerFactory.getLogger(CSVExample.class);

    public static MultiLayerNetwork buildNetwork(WebSocketSession webSocketSession) throws  Exception {

        System.out.println("In CSVExample.go()");

        //First: get the dataset using the record reader. CSVRecordReader handles loading/parsing
        int numLinesToSkip = 0;
        String delimiter = ",";
        RecordReader recordReader = new CSVRecordReader(numLinesToSkip,delimiter);
        //recordReader.initialize(new FileSplit(new ClassPathResource("iris.txt").getFile()));
        recordReader.initialize(new InputStreamInputSplit(new URL("http://learnjavafx.typepad.com/mle/iris.txt").openStream()));

        //Second: the RecordReaderDataSetIterator handles conversion to DataSet objects, ready for use in neural network
        int labelIndex = 4;     //5 values in each row of the iris.txt CSV: 4 input features followed by an integer label (class) index. Labels are the 5th value (index 4) in each row
        int numClasses = 3;     //3 classes (types of iris flowers) in the iris data set. Classes have integer values 0, 1 or 2
        int batchSize = 150;    //Iris data set: 150 examples total. We are loading all of them into one DataSet (not recommended for large data sets)
        DataSetIterator iterator = new RecordReaderDataSetIterator(recordReader,batchSize,labelIndex,numClasses);

        DataSet next = iterator.next();

        //System.out.println("After DataSet next: " + next);

        final int numInputs = 4;
        int outputNum = 3;
        int iterations = 1000;
        long seed = 6;


        //System.out.println("Build model....");
        MultiLayerConfiguration conf = new NeuralNetConfiguration.Builder()
            .seed(seed)
            .iterations(iterations)
            .activation("tanh")
            .weightInit(WeightInit.XAVIER)
            .learningRate(0.1)
            .regularization(true).l2(1e-4)
            .list()
            .layer(0, new DenseLayer.Builder().nIn(numInputs).nOut(3)
                .build())
            .layer(1, new DenseLayer.Builder().nIn(3).nOut(3)
                .build())
            .layer(2, new OutputLayer.Builder(LossFunctions.LossFunction.NEGATIVELOGLIKELIHOOD)
                .activation("softmax")
                .nIn(3).nOut(outputNum).build())
            .backprop(true).pretrain(false)
            .build();

        //run the model
        String[] inputFeatureNames = {"Sepal length", "Sepal width", "Petal length", "Petal width"};
        String[] outputLabelNames = {"I. setosa", "I. versicolor", "I. virginica"};
        MultiLayerNetwork model = new MultiLayerNetworkEnhanced(conf, inputFeatureNames, outputLabelNames);
        model.init();
        //model.setListeners(new ScoreIterationListener(100));
        model.setListeners(new ModelListener(100, webSocketSession));

        //Normalize the full data set. Our DataSet 'next' contains the full 150 examples
        next.normalizeZeroMeanZeroUnitVariance();
        next.shuffle();
        //split test and train
        SplitTestAndTrain testAndTrain = next.splitTestAndTrain(0.65);  //Use 65% of data for training

        DataSet trainingData = testAndTrain.getTrain();
        model.fit(trainingData);

        //evaluate the model on the test set
        Evaluation eval = new Evaluation(3);
        DataSet test = testAndTrain.getTest();
        INDArray output = model.output(test.getFeatureMatrix());
        //System.out.println("output: " + output);

        for (int i = 0; i < output.rows(); i++) {
            String actual = trainingData.getLabels().getRow(i).toString().trim();
            String predicted = output.getRow(i).toString().trim();
            System.out.println("actual " + actual + " vs predicted " + predicted);
        }

        eval.eval(test.getLabels(), output);
        System.out.println(eval.stats());
        //displayNetwork(model);

        // Make prediction
        // Input: 6.7, 3.0, 5.2, 2.3  Expected output: 2
        INDArray example = Nd4j.zeros(1, 4);
        example.putScalar(new int[] { 0, 0 }, 6.7);
        example.putScalar(new int[] { 0, 1 }, 3.0);
        example.putScalar(new int[] { 0, 2 }, 5.2);
        example.putScalar(new int[] { 0, 3 }, 2.3);

        int[] prediction = model.predict(example);

        System.out.println("prediction for 6.7, 3.0, 5.2, 2.3: " + prediction[0]);

        return model;

    }

    static void displayNetwork(MultiLayerNetwork mln) {
        System.out.println("multiLayerNetwork:");
        for (Layer layer : mln.getLayers()) {
            System.out.println("layer # " + layer.paramTable());
        }
    }
}

