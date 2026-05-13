package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.domain.model.InterpreterLanguage;
import com.fcbpo.workforce.domain.repository.InterpreterLanguageRepository;
import com.fcbpo.workforce.infrastructure.persistence.entity.InterpreterLanguageEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.InterpreterLanguageId;
import com.fcbpo.workforce.infrastructure.persistence.entity.LanguageEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.EmployeeEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class InterpreterLanguageRepositoryAdapter implements InterpreterLanguageRepository {

    private final InterpreterLanguageJpaRepository interpreterLanguageJpaRepository;
    private final EntityManager entityManager;

    @Override
    public List<InterpreterLanguage> findAll() {
        return interpreterLanguageJpaRepository.findAll()
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<InterpreterLanguage> findByInterpreterIdAndLanguageId(Integer interpreterId, Integer languageId) {
        return interpreterLanguageJpaRepository.findById(new InterpreterLanguageId(interpreterId, languageId))
                .map(this::toDomain);
    }

    @Override
    public List<InterpreterLanguage> findByInterpreterId(Integer interpreterId) {
        return interpreterLanguageJpaRepository.findByIdInterpreterId(interpreterId)
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public InterpreterLanguage save(InterpreterLanguage interpreterLanguage) {
        InterpreterLanguageEntity entity = InterpreterLanguageEntity.builder()
                .id(new InterpreterLanguageId(interpreterLanguage.getInterpreterId(), interpreterLanguage.getLanguageId()))
                .interpreter(entityManager.getReference(EmployeeEntity.class, interpreterLanguage.getInterpreterId()))
                .language(entityManager.getReference(LanguageEntity.class, interpreterLanguage.getLanguageId()))
                .build();

        InterpreterLanguageEntity saved = interpreterLanguageJpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteByInterpreterIdAndLanguageId(Integer interpreterId, Integer languageId) {
        interpreterLanguageJpaRepository.deleteById(new InterpreterLanguageId(interpreterId, languageId));
    }

    private InterpreterLanguage toDomain(InterpreterLanguageEntity entity) {
        return InterpreterLanguage.builder()
                .interpreterId(entity.getId().getInterpreterId())
                .languageId(entity.getId().getLanguageId())
                .build();
    }
}
