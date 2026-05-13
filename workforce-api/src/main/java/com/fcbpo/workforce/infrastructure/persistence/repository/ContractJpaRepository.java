package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.infrastructure.persistence.entity.ContractEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractJpaRepository extends JpaRepository<ContractEntity, Integer> {
}
