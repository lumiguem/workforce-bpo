package com.fcbpo.workforce.domain.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    private Integer employeeId;

    private String firstName;

    private String lastName;

    private String companyEmail;

    private String personalEmail;

    private String phoneNumber;

    private Integer roleId;
    private String roleName;

    private Integer cityId;
    private String cityName;

    private Integer countryId;
    private String countryName;
    private String countryCode;

    private Integer statusId;
    private String statusDescription;

    private Integer reportsTo;
    private String reportsToName;

    private LocalDateTime createdAt;
}