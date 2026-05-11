package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.infrastructure.persistence.entity.InterpreterDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterpreterDetailsJpaRepository extends JpaRepository<InterpreterDetailsEntity, Integer> {
}

