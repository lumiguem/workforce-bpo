package com.fcbpo.workforce.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Status {
    private Integer statusId;
    private String description;
}
