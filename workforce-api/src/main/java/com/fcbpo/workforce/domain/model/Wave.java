package com.fcbpo.workforce.domain.model;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wave {
    private Integer waveId;
    private String waveName;
    private String description;
    private LocalDate startDate;
    private java.util.List<WaveStage> stages;
}
