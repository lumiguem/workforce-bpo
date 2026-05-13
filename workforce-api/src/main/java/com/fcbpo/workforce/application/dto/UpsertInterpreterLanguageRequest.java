package com.fcbpo.workforce.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpsertInterpreterLanguageRequest {

    @NotNull
    private Integer languageId;
}
