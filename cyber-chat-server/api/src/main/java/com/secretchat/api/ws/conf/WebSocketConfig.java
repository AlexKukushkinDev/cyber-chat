package com.secretchat.api.ws.conf;

import com.secretchat.api.ws.WSMessageHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {


    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(messageWebSocketHandler(), "/ws").setAllowedOrigins("*").withSockJS();

    }

    @Bean
    public WebSocketHandler messageWebSocketHandler() {
        return new WSMessageHandler();
    }


}
