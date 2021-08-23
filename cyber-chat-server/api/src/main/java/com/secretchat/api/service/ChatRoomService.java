package com.secretchat.api.service;

import com.secretchat.api.dm.ChatRoom;
import com.secretchat.api.web.dto.ChatRoomDto;

public interface ChatRoomService {

    ChatRoom createChatRoom(ChatRoomDto dto);

    ChatRoom createOrLoadChatRoom(ChatRoomDto dto);

}
