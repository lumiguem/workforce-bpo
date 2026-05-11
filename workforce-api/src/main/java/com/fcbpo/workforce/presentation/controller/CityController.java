package com.fcbpo.workforce.presentation.controller;

import com.fcbpo.workforce.domain.model.City;
import com.fcbpo.workforce.application.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CityController {
    private final CityService cityService;

    @GetMapping
    public List<City> getAllCities(@RequestParam(value = "countryId", required = false) Integer countryId) {
        return cityService.getAllCities(countryId);
    }
}
