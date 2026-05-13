package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.domain.model.InterpreterDetails;
import com.fcbpo.workforce.domain.repository.InterpreterDetailsRepository;
import com.fcbpo.workforce.infrastructure.persistence.entity.InterpreterDetailsEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class InterpreterDetailsRepositoryAdapter implements InterpreterDetailsRepository {

    private final InterpreterDetailsJpaRepository interpreterDetailsJpaRepository;

    @Override
    public Optional<InterpreterDetails> findByInterpreterId(Integer interpreterId) {
        return interpreterDetailsJpaRepository.findById(interpreterId)
                .map(this::toDomain);
    }

    @Override
    public InterpreterDetails save(InterpreterDetails details) {
        InterpreterDetailsEntity entity = InterpreterDetailsEntity.builder()
                .interpreterId(details.getInterpreterId())
                .waveId(details.getWaveId())
                .contractId(details.getContractId())
                .startDate(details.getStartDate())
                .nestingDate(details.getNestingDate())
                .productionStartDate(details.getProductionStartDate())
                .build();

        InterpreterDetailsEntity saved = interpreterDetailsJpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteByInterpreterId(Integer interpreterId) {
        interpreterDetailsJpaRepository.deleteById(interpreterId);
    }

    @Override
    public List<InterpreterDetails> findAll() {
        return interpreterDetailsJpaRepository.findAll()
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public List<InterpreterDetails> findByWaveIdNotNull() {
        return interpreterDetailsJpaRepository.findByWaveIdIsNotNull()
                .stream()
                .map(this::toDomain)
                .toList();
    }

    private InterpreterDetails toDomain(InterpreterDetailsEntity entity) {
        return InterpreterDetails.builder()
                .interpreterId(entity.getInterpreterId())
                .waveId(entity.getWaveId())
                .contractId(entity.getContractId())
                .startDate(entity.getStartDate())
                .nestingDate(entity.getNestingDate())
                .productionStartDate(entity.getProductionStartDate())
                .build();
    }
}
