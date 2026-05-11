package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.domain.model.City;
import com.fcbpo.workforce.domain.repository.CityRepository;
import com.fcbpo.workforce.infrastructure.persistence.entity.CityEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CityRepositoryAdapter implements CityRepository {
    private final CityJpaRepository cityJpaRepository;

    @Override
    public List<City> findAll() {
        return cityJpaRepository.findAll().stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public List<City> findByCountryId(Integer countryId) {
        return cityJpaRepository.findByCountry_CountryId(countryId).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<City> findById(Integer id) {
        return cityJpaRepository.findById(id).map(this::toDomain);
    }

    private City toDomain(CityEntity entity) {
        return City.builder()
                .cityId(entity.getCityId())
                .cityName(entity.getCityName())
                .countryId(entity.getCountry() != null ? entity.getCountry().getCountryId() : null)
                .build();
    }
}
