package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.domain.model.Country;
import com.fcbpo.workforce.domain.repository.CountryRepository;
import com.fcbpo.workforce.infrastructure.persistence.entity.CountryEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CountryRepositoryAdapter implements CountryRepository {
    private final CountryJpaRepository countryJpaRepository;

    @Override
    public List<Country> findAll() {
        return countryJpaRepository.findAll().stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Country> findById(Integer id) {
        return countryJpaRepository.findById(id).map(this::toDomain);
    }

    private Country toDomain(CountryEntity entity) {
        return Country.builder()
                .countryId(entity.getCountryId())
                .countryName(entity.getCountryName())
                .countryCode(entity.getCountryCode())
                .build();
    }
}
