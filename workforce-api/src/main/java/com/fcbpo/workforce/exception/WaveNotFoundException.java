package com.fcbpo.workforce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class WaveNotFoundException extends RuntimeException {

    public WaveNotFoundException(Integer waveId) {
        super("Wave not found: " + waveId);
    }
}
