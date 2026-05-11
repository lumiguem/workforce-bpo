package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.domain.model.Wave;
import com.fcbpo.workforce.domain.model.WaveStage;
import com.fcbpo.workforce.domain.repository.WaveRepository;
import com.fcbpo.workforce.infrastructure.persistence.entity.WaveEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.WaveStageEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class WaveRepositoryAdapter implements WaveRepository {
    private final WaveJpaRepository waveJpaRepository;

    @Override
    public List<Wave> findAll() {
        return waveJpaRepository.findAll().stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Wave> findById(Integer id) {
        return waveJpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Wave save(Wave wave) {
        WaveEntity entity = toEntity(wave);
        WaveEntity saved = waveJpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(Integer id) {
        waveJpaRepository.deleteById(id);
    }

    private Wave toDomain(WaveEntity entity) {
        return Wave.builder()
                .waveId(entity.getWaveId())
                .waveName(entity.getWaveName())
                .description(entity.getDescription())
                .startDate(entity.getStartDate())
                .stages(entity.getStages() == null ? null : entity.getStages().stream()
                        .map(s -> WaveStage.builder()
                                .waveStageId(s.getWaveStageId())
                                .stageName(s.getStageName().name())
                                .startDate(s.getStartDate())
                                .endDate(s.getEndDate())
                                .build())
                        .toList())
                .build();
    }

    private WaveEntity toEntity(Wave wave) {
        WaveEntity entity = WaveEntity.builder()
                .waveId(wave.getWaveId())
                .waveName(wave.getWaveName())
                .description(wave.getDescription())
                .startDate(wave.getStartDate())
                .build();
        
        if (wave.getStages() != null) {
            entity.setStages(wave.getStages().stream()
                .map(s -> WaveStageEntity.builder()
                        .waveStageId(s.getWaveStageId())
                        .wave(entity)
                        .stageName(WaveStageEntity.StageName.valueOf(s.getStageName()))
                        .startDate(s.getStartDate())
                        .endDate(s.getEndDate())
                        .build())
                .toList());
        }
        
        return entity;
    }
}
