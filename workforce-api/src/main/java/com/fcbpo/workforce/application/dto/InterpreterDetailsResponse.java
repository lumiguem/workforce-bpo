package com.fcbpo.workforce.application.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterpreterDetailsResponse {

    private Integer interpreterId;
    private Integer waveId;
    private Integer contractId;
    private LocalDate startDate;
    private LocalDate nestingDate;
    private LocalDate productionStartDate;
}

