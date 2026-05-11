package com.fcbpo.workforce.domain.model;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterpreterDetails {

    private Integer interpreterId;
    private Integer waveId;
    private Integer contractId;
    private LocalDate startDate;
    private LocalDate nestingDate;
    private LocalDate productionStartDate;
}

