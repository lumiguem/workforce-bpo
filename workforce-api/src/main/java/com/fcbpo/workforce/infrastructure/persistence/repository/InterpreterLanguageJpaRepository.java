package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.infrastructure.persistence.entity.InterpreterLanguageEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.InterpreterLanguageId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterpreterLanguageJpaRepository extends JpaRepository<InterpreterLanguageEntity, InterpreterLanguageId> {

    List<InterpreterLanguageEntity> findByIdInterpreterId(Integer interpreterId);
}
