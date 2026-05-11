package com.fcbpo.workforce.domain.repository;

import com.fcbpo.workforce.domain.model.City;
import java.util.List;
import java.util.Optional;

public interface CityRepository {
    List<City> findAll();
    List<City> findByCountryId(Integer countryId);
    Optional<City> findById(Integer id);
}
