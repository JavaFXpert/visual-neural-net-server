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
package com.javafxpert.neuralnetviz;

import com.javafxpert.neuralnetviz.scenario.*;
import com.javafxpert.neuralnetviz.state.MultiLayerNetworkState;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class CounterHandler extends TextWebSocketHandler {

    WebSocketSession session;

    // This will send only to one client(most recently connected)
    public void counterIncrementedCallback(int counter) {
        System.out.println("Trying to send:" + counter);
        if (session != null && session.isOpen()) {
            try {
                System.out.println("Now sending:" + counter);
                session.sendMessage(new TextMessage("{\"value\": \"" + counter + "\"}"));
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("Don't have open session to send:" + counter);
        }
    }

    public void sendModelJson(String modelJson) {

    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("Connection established");
        this.session = session;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message)
            throws Exception {
        if ("{\"name\":\"CLOSE\"}".equalsIgnoreCase(message.getPayload())) {
            session.close();
        }
        else if ("{\"name\":\"XorExample\"}".equalsIgnoreCase(message.getPayload())) {
            MultiLayerNetworkState.setNeuralNetworkModel(XorExample.buildNetwork(session));
        }
        else if ("{\"name\":\"CSVExample\"}".equalsIgnoreCase(message.getPayload())) {
            MultiLayerNetworkState.setNeuralNetworkModel(CSVExample.buildNetwork(session));
        }
        else if ("{\"name\":\"MLPClassifierMoon\"}".equalsIgnoreCase(message.getPayload())) {
            MultiLayerNetworkState.setNeuralNetworkModel(MLPClassifierMoon.buildNetwork(session));
        }
        else if ("{\"name\":\"SpeedDating\"}".equalsIgnoreCase(message.getPayload())) {
            MultiLayerNetworkState.setNeuralNetworkModel(SpeedDating.buildNetwork(session));
        }
        else if ("{\"name\":\"RegressionSum\"}".equalsIgnoreCase(message.getPayload())) {
            MultiLayerNetworkState.setNeuralNetworkModel(RegressionSum.buildNetwork(session));
        }
        else if ("{\"name\":\"BasicRNNExample\"}".equalsIgnoreCase(message.getPayload())) {
            MultiLayerNetworkState.setNeuralNetworkModel(BasicRNNExample.buildNetwork(session));
        }
        else {
            System.out.println("Received:" + message.getPayload());
        }
    }

}
