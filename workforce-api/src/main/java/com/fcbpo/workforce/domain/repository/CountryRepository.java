package com.fcbpo.workforce.domain.repository;

import com.fcbpo.workforce.domain.model.Country;
import java.util.List;
import java.util.Optional;

public interface CountryRepository {
    List<Country> findAll();
    Optional<Country> findById(Integer id);
}
