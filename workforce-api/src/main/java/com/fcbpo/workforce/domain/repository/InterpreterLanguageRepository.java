package com.fcbpo.workforce.domain.repository;

import com.fcbpo.workforce.domain.model.InterpreterLanguage;

import java.util.List;
import java.util.Optional;

public interface InterpreterLanguageRepository {

    List<InterpreterLanguage> findAll();

    Optional<InterpreterLanguage> findByInterpreterIdAndLanguageId(Integer interpreterId, Integer languageId);

    List<InterpreterLanguage> findByInterpreterId(Integer interpreterId);

    InterpreterLanguage save(InterpreterLanguage interpreterLanguage);

    void deleteByInterpreterIdAndLanguageId(Integer interpreterId, Integer languageId);
}
