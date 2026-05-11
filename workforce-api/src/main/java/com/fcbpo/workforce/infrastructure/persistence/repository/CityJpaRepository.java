package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.infrastructure.persistence.entity.CityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CityJpaRepository extends JpaRepository<CityEntity, Integer> {
    List<CityEntity> findByCountry_CountryId(Integer countryId);
}
