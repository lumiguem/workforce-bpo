package com.fcbpo.workforce.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    private Integer roleId;
    private String roleName;
}
