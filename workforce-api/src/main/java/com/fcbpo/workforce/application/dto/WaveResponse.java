package com.fcbpo.workforce.application.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaveResponse {
    private Integer waveId;
    private String waveName;
    private String description;
    private LocalDate startDate;
    private String currentStage; // TRAINING, NESTING, PRODUCTION, COMPLETED, UPCOMING
    private List<WaveStageResponse> stages;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WaveStageResponse {
        private Integer waveStageId;
        private String stageName;
        private LocalDate startDate;
        private LocalDate endDate;
        private boolean isCurrent;
    }
}
