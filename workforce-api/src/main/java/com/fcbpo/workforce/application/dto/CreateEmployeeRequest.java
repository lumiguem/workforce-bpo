package com.fcbpo.workforce.application.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEmployeeRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String companyEmail;

    @Email
    private String personalEmail;

    private String phoneNumber;

    @NotNull
    private Integer roleId;

    private Integer cityId;

    private Integer countryId;

    @NotNull
    @JsonAlias("status_id")
    private Integer statusId;

    private Integer reportsTo;
}
