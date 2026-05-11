package com.fcbpo.workforce.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "interpreter_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterpreterDetailsEntity {

    @Id
    @Column(name = "interpreter_id")
    private Integer interpreterId;

    @Column(name = "wave_id")
    private Integer waveId;

    @Column(name = "contract_id")
    private Integer contractId;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "nesting_date")
    private LocalDate nestingDate;

    @Column(name = "production_start_date")
    private LocalDate productionStartDate;
}

