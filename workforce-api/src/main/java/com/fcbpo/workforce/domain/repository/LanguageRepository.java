package com.fcbpo.workforce.domain.repository;

import com.fcbpo.workforce.domain.model.Language;

import java.util.List;
import java.util.Optional;

public interface LanguageRepository {

    List<Language> findAll();

    Optional<Language> findById(Integer id);
}
