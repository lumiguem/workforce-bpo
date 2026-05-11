package com.fcbpo.workforce.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "waves")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaveEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wave_id")
    private Integer waveId;

    @Column(name = "wave_name", nullable = false)
    private String waveName;

    @Column(name = "description")
    private String description;

    @Column(name = "start_date")
    private LocalDate startDate;

    @OneToMany(mappedBy = "wave", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<WaveStageEntity> stages;
}
