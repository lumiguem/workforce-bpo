package com.fcbpo.workforce.domain.repository;

import com.fcbpo.workforce.domain.model.InterpreterDetails;

import java.util.List;
import java.util.Optional;

public interface InterpreterDetailsRepository {

    Optional<InterpreterDetails> findByInterpreterId(Integer interpreterId);

    InterpreterDetails save(InterpreterDetails details);

    void deleteByInterpreterId(Integer interpreterId);

    List<InterpreterDetails> findAll();
}

