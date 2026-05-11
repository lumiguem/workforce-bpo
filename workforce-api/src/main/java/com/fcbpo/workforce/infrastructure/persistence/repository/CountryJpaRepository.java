package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.infrastructure.persistence.entity.CountryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryJpaRepository extends JpaRepository<CountryEntity, Integer> {
}
