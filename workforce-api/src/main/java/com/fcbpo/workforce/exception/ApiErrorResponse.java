package com.fcbpo.workforce.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Value;

import java.time.OffsetDateTime;
import java.util.List;

@Value
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    Integer status;
    String error;
    String message;
    String path;
    OffsetDateTime timestamp;
    String traceId;
    List<FieldError> fieldErrors;

    @Value
    @Builder
    public static class FieldError {
        String field;
        String message;
    }
}

