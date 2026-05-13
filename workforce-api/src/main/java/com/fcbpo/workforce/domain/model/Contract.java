package com.fcbpo.workforce.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {
    private Integer contractId;
    private String contractType;
}
