package com.fcbpo.workforce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class WaveStagesNotConfiguredException extends RuntimeException {

    public WaveStagesNotConfiguredException(Integer waveId) {
        super("Wave stages not configured for wave: " + waveId);
    }
}
