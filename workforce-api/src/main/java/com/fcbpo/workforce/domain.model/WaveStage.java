package com.fcbpo.workforce.domain.model;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaveStage {
    private Integer waveStageId;
    private String stageName; // TRAINING, NESTING, PRODUCTION
    private LocalDate startDate;
    private LocalDate endDate;
}
