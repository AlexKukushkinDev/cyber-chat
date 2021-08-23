package com.secretchat.api.ws;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class WebSocketManager {


    private Map<String, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();

    private Map<String, String> sessionUsers = new ConcurrentHashMap<>();



    public synchronized void addSession(WebSocketSession socketSession) {

        String uid = socketSession.getUri().getQuery().substring(4);

        System.out.println(uid);

        if (!userSessions.containsKey(uid)) {
            Set<WebSocketSession> webSocketSessions = new HashSet<>();
            webSocketSessions.add(socketSession);
            userSessions.put(uid, webSocketSessions);
        } else {
            userSessions.get(uid).add(socketSession);
        }
        sessionUsers.put(socketSession.getId(), uid);

    }

    public synchronized void removeSession(WebSocketSession webSocketSession) {
        String uid = sessionUsers.get(webSocketSession.getId());
        sessionUsers.remove(webSocketSession.getId());

        if (uid!=null && userSessions.containsKey(uid)) {
            userSessions.get(uid).remove(webSocketSession);
            if (userSessions.get(uid).size() == 0) {
                userSessions.remove(uid);
            }
        }

    }

    public Set<WebSocketSession> getSessionsForUserId(String userId){
        return userSessions.get(userId);
    }

    public Set<WebSocketSession> getSessions(){
        return userSessions.entrySet().stream()
                .map(es-> new HashSet(es.getValue()))
                .reduce((s1,s2)->{s1.addAll(s2); return s1;})
                .orElse(new HashSet<WebSocketSession>());
    }

}