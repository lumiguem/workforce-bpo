package com.fcbpo.workforce.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "wave_stages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaveStageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wave_stage_id")
    private Integer waveStageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wave_id")
    private WaveEntity wave;

    @Enumerated(EnumType.STRING)
    @Column(name = "stage_name")
    private StageName stageName;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    public enum StageName {
        TRAINING, NESTING, PRODUCTION
    }
}
