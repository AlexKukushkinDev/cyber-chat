package com.secretchat.api.dm;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.time.LocalDateTime;



@Data
public abstract class InternalPersistable implements Serializable {

    @Id
    private String id;

    @NotEmpty
    @CreatedDate
    private LocalDateTime createdDate;

    @NotEmpty
    @LastModifiedDate
    private LocalDateTime updated;

}
