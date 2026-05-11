package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.infrastructure.persistence.entity.StatusEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusJpaRepository extends JpaRepository<StatusEntity, Integer> {
}
