package com.secretchat.api.repo;

import com.secretchat.api.dm.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {

    ChatRoom findByKey(String key);

    ChatRoom findByUrl(String url);

}
