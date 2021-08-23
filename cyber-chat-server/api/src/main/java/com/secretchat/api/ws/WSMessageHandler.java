package com.secretchat.api.ws;

import com.secretchat.api.ws.service.CustomSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

@Component
public class WSMessageHandler extends TextWebSocketHandler {

    @Autowired
    WebSocketManager manager;

    @Autowired
    CustomSocketService wsService;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws Exception {

        String uid = session.getUri().getQuery().substring(4);

        wsService.send(uid, textMessage.getPayload());

//        System.out.println("handle TextMessage");
//
//        if ("ping".equalsIgnoreCase(textMessage.getPayload())) {
//            session.sendMessage(new TextMessage("pong"));
//        } else {
//            CharSequence sequence = textMessage.getPayload();
//            session.sendMessage(new TextMessage(sequence));
//        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        manager.addSession(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        manager.removeSession(session);
    }

}