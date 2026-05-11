package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.domain.model.City;
import com.fcbpo.workforce.domain.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CityService {
    private final CityRepository cityRepository;

    public List<City> getAllCities(Integer countryId) {
        if (countryId != null) {
            return cityRepository.findByCountryId(countryId);
        }
        return cityRepository.findAll();
    }
}
