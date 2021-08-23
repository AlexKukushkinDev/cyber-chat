package com.secretchat.api.ws.service;

import com.secretchat.api.ws.WebSocketManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Set;

@Slf4j
@Service
public class CustomSocketService {

    @Autowired
    WebSocketManager manager;


    public void send(String uidTo, String message) throws Exception {
        Set<WebSocketSession> sessions = manager.getSessionsForUserId(uidTo);
        if (sessions == null || sessions.size() == 0) {
            log.debug("no sessions found for user id={}", uidTo);
            return;
        }
        for (WebSocketSession session : sessions) {
            log.info("Sending WS message to user, WSid={}, UserId={}", session.getId(), uidTo);
            session.sendMessage(new TextMessage(message));

        }

    }

}
