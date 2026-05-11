package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.infrastructure.persistence.entity.WaveEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WaveJpaRepository extends JpaRepository<WaveEntity, Integer> {

    @EntityGraph(attributePaths = {"stages"})
    List<WaveEntity> findAll();

    @EntityGraph(attributePaths = {"stages"})
    Optional<WaveEntity> findById(Integer id);
}
