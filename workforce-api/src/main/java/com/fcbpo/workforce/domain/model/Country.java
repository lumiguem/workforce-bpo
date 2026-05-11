package com.fcbpo.workforce.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Country {
    private Integer countryId;
    private String countryName;
    private String countryCode;
}
