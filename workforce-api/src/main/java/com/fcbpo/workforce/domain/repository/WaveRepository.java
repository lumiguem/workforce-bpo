package com.fcbpo.workforce.domain.repository;

import com.fcbpo.workforce.domain.model.Wave;
import java.util.List;
import java.util.Optional;

public interface WaveRepository {
    List<Wave> findAll();
    Optional<Wave> findById(Integer id);
    Wave save(Wave wave);
    void deleteById(Integer id);
}
