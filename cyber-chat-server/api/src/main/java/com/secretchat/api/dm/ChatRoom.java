package com.secretchat.api.dm;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotEmpty;


@Data
@Builder
@Document
public class ChatRoom extends InternalPersistable{

    @NotEmpty
    @Indexed(unique = true)
    private String key;

    @NotEmpty
    @Indexed(unique = true)
    private String url;

}