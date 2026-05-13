package com.fcbpo.workforce.domain.repository;

import com.fcbpo.workforce.domain.model.Contract;

import java.util.Optional;

public interface ContractRepository {
    Optional<Contract> findById(Integer id);
}
