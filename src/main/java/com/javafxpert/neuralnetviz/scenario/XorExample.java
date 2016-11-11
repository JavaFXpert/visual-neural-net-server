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

import com.javafxpert.neuralnetviz.model.MultiLayerNetworkEnhanced;
import org.deeplearning4j.eval.Evaluation;
import com.javafxpert.neuralnetviz.model.ModelListener;
import org.deeplearning4j.nn.api.Layer;
import org.deeplearning4j.nn.api.OptimizationAlgorithm;
import org.deeplearning4j.nn.conf.MultiLayerConfiguration;
import org.deeplearning4j.nn.conf.NeuralNetConfiguration;
import org.deeplearning4j.nn.conf.NeuralNetConfiguration.ListBuilder;
import org.deeplearning4j.nn.conf.distribution.UniformDistribution;
import org.deeplearning4j.nn.conf.layers.DenseLayer;
import org.deeplearning4j.nn.conf.layers.OutputLayer.Builder;
import org.deeplearning4j.nn.multilayer.MultiLayerNetwork;
import org.deeplearning4j.nn.params.DefaultParamInitializer;
import org.deeplearning4j.nn.weights.WeightInit;
//import org.deeplearning4j.ui.weights.HistogramIterationListener;
import org.deeplearning4j.optimize.listeners.ScoreIterationListener;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.dataset.DataSet;
import org.nd4j.linalg.factory.Nd4j;
import org.nd4j.linalg.lossfunctions.LossFunctions;
import org.springframework.web.socket.WebSocketSession;

/**
 * This basic example shows how to manually create a DataSet and train it to an
 * basic Network.
 *
 * The network consists in 2 input-neurons, 1 hidden-layer with 4
 * hidden-neurons, and 2 output-neurons.
 *
 * I choose 2 output neurons, (the first fires for false, the second fires for
 * true) because the Evaluation class needs one neuron per classification.
 *
 * @author Peter Großmann
 *
 */
public class XorExample {
	public static MultiLayerNetworkEnhanced buildNetwork(WebSocketSession webSocketSession) throws  Exception {
	//public static void main(String[] args) throws  Exception {

		//System.out.println("In XorExample.go()");

		// list off input values, 4 training samples with data for 2
		// input-neurons each
		INDArray input = Nd4j.zeros(4, 2);

		//System.out.println("After INDArray input: " + input);


		// correspondending list with expected output values, 4 training samples
		// with data for 2 output-neurons each
		INDArray labels = Nd4j.zeros(4, 2);

		// create first dataset
		// when first input=0 and second input=0
		input.putScalar(new int[] { 0, 0 }, 0);
		input.putScalar(new int[] { 0, 1 }, 0);
		// then the first output fires for false, and the second is 0 (see class
		// comment)
		labels.putScalar(new int[] { 0, 0 }, 1);
		labels.putScalar(new int[] { 0, 1 }, 0);

		// when first input=1 and second input=0
		input.putScalar(new int[] { 1, 0 }, 1);
		input.putScalar(new int[] { 1, 1 }, 0);
		// then xor is true, therefore the second output neuron fires
		labels.putScalar(new int[] { 1, 0 }, 0);
		labels.putScalar(new int[] { 1, 1 }, 1);

		// same as above
		input.putScalar(new int[] { 2, 0 }, 0);
		input.putScalar(new int[] { 2, 1 }, 1);
		labels.putScalar(new int[] { 2, 0 }, 0);
		labels.putScalar(new int[] { 2, 1 }, 1);

		// when both inputs fire, xor is false again - the first output should
		// fire
		input.putScalar(new int[] { 3, 0 }, 1);
		input.putScalar(new int[] { 3, 1 }, 1);
		labels.putScalar(new int[] { 3, 0 }, 1);
		labels.putScalar(new int[] { 3, 1 }, 0);

		//System.out.println("Before DataSet ds");

		// create dataset object
		DataSet ds = new DataSet(input, labels);

		//System.out.println("After DataSet ds: " + ds);

		// Set up network configuration
		NeuralNetConfiguration.Builder builder = new NeuralNetConfiguration.Builder();
		// how often should the training set be run, we need something above
		// 1000, or a higher learning-rate - found this values just by trial and
		// error
		builder.iterations(10000);
		// learning rate
		builder.learningRate(0.1);
		// fixed seed for the random generator, so any run of this program
		// brings the same results - may not work if you do something like
		// ds.shuffle()
		builder.seed(123);
		// not applicable, this network is to small - but for bigger networks it
		// can help that the network will not only recite the training data
		builder.useDropConnect(false);
		// a standard algorithm for moving on the error-plane, this one works
		// best for me, LINE_GRADIENT_DESCENT or CONJUGATE_GRADIENT can do the
		// job, too - it's an empirical value which one matches best to
		// your problem
		builder.optimizationAlgo(OptimizationAlgorithm.STOCHASTIC_GRADIENT_DESCENT);
		// init the bias with 0 - empirical value, too
		builder.biasInit(0);
		// from "http://deeplearning4j.org/architecture": The networks can
		// process the input more quickly and more accurately by ingesting
		// minibatches 5-10 elements at a time in parallel.
		// this example runs better without, because the dataset is smaller than
		// the mini batch size
		builder.miniBatch(false);

		// create a multilayer network with 2 layers (including the output
		// layer, excluding the input payer)
		ListBuilder listBuilder = builder.list();

		DenseLayer.Builder hiddenLayerBuilder = new DenseLayer.Builder();
		// two input connections - simultaneously defines the number of input
		// neurons, because it's the first non-input-layer
		hiddenLayerBuilder.nIn(2);
		// number of outgooing connections, nOut simultaneously defines the
		// number of neurons in this layer
		hiddenLayerBuilder.nOut(2);
		// put the output through the sigmoid function, to cap the output
		// valuebetween 0 and 1
		hiddenLayerBuilder.activation("sigmoid");
		// random initialize weights with values between 0 and 1
		hiddenLayerBuilder.weightInit(WeightInit.DISTRIBUTION);
		hiddenLayerBuilder.dist(new UniformDistribution(0, 1));

		// build and set as layer 0
		listBuilder.layer(0, hiddenLayerBuilder.build());

		// MCXENT or NEGATIVELOGLIKELIHOOD work ok for this example - this
		// function calculates the error-value
		// From homepage: Your net's purpose will determine the loss funtion you
		// use. For pretraining, choose reconstruction entropy. For
		// classification, use multiclass cross entropy.
		Builder outputLayerBuilder = new Builder(LossFunctions.LossFunction.NEGATIVELOGLIKELIHOOD);
		// must be the same amout as neurons in the layer before
		outputLayerBuilder.nIn(2);
		// two neurons in this layer
		outputLayerBuilder.nOut(2);
		outputLayerBuilder.activation("sigmoid");
		outputLayerBuilder.weightInit(WeightInit.DISTRIBUTION);
		outputLayerBuilder.dist(new UniformDistribution(0, 1));
		listBuilder.layer(1, outputLayerBuilder.build());

		// no pretrain phase for this network
		listBuilder.pretrain(false);

		// seems to be mandatory
		// according to agibsonccc: You typically only use that with
		// pretrain(true) when you want to do pretrain/finetune without changing
		// the previous layers finetuned weights that's for autoencoders and
		// rbms
		listBuilder.backprop(true);

		// build and init the network, will check if everything is configured
		// correct
		MultiLayerConfiguration conf = listBuilder.build();

		String[] inputFeatureNames = {"true (1) or false (0)", "true (1) or false (0)"};
		String[] outputLabelNames = {"false", "true"};
		MultiLayerNetworkEnhanced net = new MultiLayerNetworkEnhanced(conf, inputFeatureNames, outputLabelNames);
		net.init();

		// add an listener which outputs the error every 100 parameter updates
		//net.setListeners(new ScoreIterationListener(100));
		net.setListeners(new ModelListener(100, webSocketSession));

		// C&P from GravesLSTMCharModellingExample
		// Print the number of parameters in the network (and for each layer)
		Layer[] layers = net.getLayers();
		int totalNumParams = 0;
		for (int i = 0; i < layers.length; i++) {
			int nParams = layers[i].numParams();
			//System.out.println("Number of parameters in layer " + i + ": " + nParams);
			totalNumParams += nParams;
		}
		//System.out.println("Total number of network parameters: " + totalNumParams);

		// here the actual learning takes place
		net.fit(ds);

		// create output for every training sample
		INDArray output = net.output(ds.getFeatureMatrix());
        //System.out.println("output: " + output);

        for (int i = 0; i < output.rows(); i++) {
            String actual = ds.getLabels().getRow(i).toString().trim();
            String predicted = output.getRow(i).toString().trim();
            //System.out.println("actual " + actual + " vs predicted " + predicted);
        }

		// let Evaluation prints stats how often the right output had the
		// highest value
		Evaluation eval = new Evaluation(2);
		eval.eval(ds.getLabels(), output);
		System.out.println(eval.stats());


        //displayNetwork(net);

        // Make prediction
        INDArray example = Nd4j.zeros(1, 2);
        // create first dataset
        // when first input=0 and second input=0
        example.putScalar(new int[] { 0, 0 }, 0);
        example.putScalar(new int[] { 0, 1 }, 1);

        int[] prediction = net.predict(example);

        System.out.println("prediction for 0, 1: " + prediction[0]);

		    return net;
    }

    static void displayNetwork(MultiLayerNetwork mln) {
        System.out.println("multiLayerNetwork:");
        for (Layer layer : mln.getLayers()) {
            System.out.println("layer # " + layer.paramTable());
            INDArray w = layer.getParam(DefaultParamInitializer.WEIGHT_KEY);
            System.out.println("Weights: " + w);
            INDArray b = layer.getParam(DefaultParamInitializer.BIAS_KEY);
            System.out.println("Bias: " + b);
        }
    }
}
