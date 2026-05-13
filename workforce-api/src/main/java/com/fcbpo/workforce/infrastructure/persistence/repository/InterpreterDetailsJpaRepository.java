package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.infrastructure.persistence.entity.InterpreterDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InterpreterDetailsJpaRepository extends JpaRepository<InterpreterDetailsEntity, Integer> {

    List<InterpreterDetailsEntity> findByWaveIdIsNotNull();

    @Query("""
        select d.waveId as waveId, count(d) as interpreterCount
        from InterpreterDetailsEntity d
        where d.waveId is not null
        group by d.waveId
    """)
    List<WaveInterpreterCountProjection> countInterpretersByWaveId();

    interface WaveInterpreterCountProjection {
        Integer getWaveId();
        Long getInterpreterCount();
    }
}
