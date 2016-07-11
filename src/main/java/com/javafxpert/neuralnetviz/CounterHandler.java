package com.javafxpert.neuralnetviz;

import com.javafxpert.neuralnetviz.scenario.CSVExample;
import com.javafxpert.neuralnetviz.scenario.XorExample;
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
        else if ("{\"name\":\"Fred\"}".equalsIgnoreCase(message.getPayload())) {
            XorExample.go(session);
        }
        else {
            System.out.println("Received:" + message.getPayload());
        }
    }

}
