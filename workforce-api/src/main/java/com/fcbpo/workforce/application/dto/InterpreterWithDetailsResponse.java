package com.fcbpo.workforce.application.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterpreterWithDetailsResponse {

    private Integer employeeId;
    private String firstName;
    private String lastName;
    private String companyEmail;
    private String personalEmail;
    private String phoneNumber;
    private Integer roleId;
    private Integer cityId;
    private Integer countryId;
    private Integer statusId;
    private Integer reportsTo;
    private LocalDateTime createdAt;

    private Details details;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Details {
        private Integer interpreterId;
        private Integer waveId;
        private Integer contractId;
        private LocalDate startDate;
        private LocalDate nestingDate;
        private LocalDate productionStartDate;
    }
}

