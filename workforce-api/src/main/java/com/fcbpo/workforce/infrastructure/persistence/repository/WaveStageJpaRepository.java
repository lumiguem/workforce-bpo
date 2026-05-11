package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.infrastructure.persistence.entity.WaveStageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WaveStageJpaRepository extends JpaRepository<WaveStageEntity, Integer> {
}
