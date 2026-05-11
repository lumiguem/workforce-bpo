package com.fcbpo.workforce.application.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpsertInterpreterDetailsRequest {

    private Integer waveId;
    private Integer contractId;
    private LocalDate startDate;
    private LocalDate nestingDate;
    private LocalDate productionStartDate;
}

