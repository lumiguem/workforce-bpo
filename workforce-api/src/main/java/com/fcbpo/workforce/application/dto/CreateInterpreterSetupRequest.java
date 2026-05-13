package com.fcbpo.workforce.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateInterpreterSetupRequest {

    @NotNull
    private Integer waveId;

    @NotNull
    private Integer languageId;

    private Integer contractId = 1;

    private LocalDate startDate;
    private LocalDate nestingDate;
    private LocalDate productionStartDate;
}
