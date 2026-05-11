package com.fcbpo.workforce.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class City {
    private Integer cityId;
    private String cityName;
    private Integer countryId;
}
