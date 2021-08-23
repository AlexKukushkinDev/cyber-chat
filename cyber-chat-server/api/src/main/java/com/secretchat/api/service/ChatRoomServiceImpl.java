package com.secretchat.api.service;

import com.secretchat.api.dm.ChatRoom;
import com.secretchat.api.repo.ChatRoomRepository;
import com.secretchat.api.web.dto.ChatRoomDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.UUID;

import static java.util.Objects.isNull;

@Slf4j
@Service
public class ChatRoomServiceImpl implements ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRepository;

    @Override
    public ChatRoom createChatRoom(ChatRoomDto dto) {

        ChatRoom room = ChatRoom.builder()
                .key(dto.getKey())
                .url(this.generateUniqueURL())
                .build();

        return chatRepository.save(room);
    }

    @Override
    public ChatRoom createOrLoadChatRoom(ChatRoomDto dto) {

        Assert.notNull(dto.getKey(), "Null 'key' value");

        ChatRoom room = chatRepository.findByKey(dto.getKey());

        if(isNull(room)){
            room = this.createChatRoom(dto);
        }

        return room;
    }




    private String generateUniqueURL() {

        return UUID.randomUUID().toString();

    }


}
