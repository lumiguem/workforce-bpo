package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.domain.model.Language;
import com.fcbpo.workforce.domain.repository.LanguageRepository;
import com.fcbpo.workforce.infrastructure.persistence.entity.LanguageEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class LanguageRepositoryAdapter implements LanguageRepository {

    private final LanguageJpaRepository languageJpaRepository;

    @Override
    public List<Language> findAll() {
        return languageJpaRepository.findAll()
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Language> findById(Integer id) {
        return languageJpaRepository.findById(id)
                .map(this::toDomain);
    }

    private Language toDomain(LanguageEntity entity) {
        return Language.builder()
                .languageId(entity.getLanguageId())
                .languageName(entity.getLanguageName())
                .build();
    }
}
