package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.domain.model.Contract;
import com.fcbpo.workforce.domain.repository.ContractRepository;
import com.fcbpo.workforce.infrastructure.persistence.entity.ContractEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ContractRepositoryAdapter implements ContractRepository {

    private final ContractJpaRepository contractJpaRepository;

    @Override
    public Optional<Contract> findById(Integer id) {
        return contractJpaRepository.findById(id).map(this::toDomain);
    }

    private Contract toDomain(ContractEntity entity) {
        return Contract.builder()
                .contractId(entity.getContractId())
                .contractType(entity.getContractType())
                .build();
    }
}
