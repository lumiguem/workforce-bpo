package com.fcbpo.workforce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class InterpreterDetailsNotFoundException extends RuntimeException {

    public InterpreterDetailsNotFoundException(Integer interpreterId) {
        super("Interpreter details not found for interpreter: " + interpreterId);
    }
}

