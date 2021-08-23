package com.secretchat.api.web.controller;

import com.secretchat.api.dm.ChatRoom;
import com.secretchat.api.service.ChatRoomService;
import com.secretchat.api.web.dto.ChatRoomDto;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private ModelMapper modelMapper;



    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ChatRoomDto loadChatRoom(@RequestBody ChatRoomDto dto) {

        log.info("Creating room chat");

        ChatRoom room = chatRoomService.createOrLoadChatRoom(dto);

        return modelMapper.map(room, ChatRoomDto.class);
    }


}
