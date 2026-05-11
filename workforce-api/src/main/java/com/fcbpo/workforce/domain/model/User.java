package com.fcbpo.workforce.domain.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    private Long id;
    private String email;
    private String password;
    private String role;
    private Long employeeId;
}