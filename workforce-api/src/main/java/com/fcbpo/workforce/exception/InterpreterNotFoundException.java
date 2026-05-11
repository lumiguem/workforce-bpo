package com.fcbpo.workforce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class InterpreterNotFoundException extends RuntimeException {

    public InterpreterNotFoundException(Integer id) {
        super("Interpreter not found: " + id);
    }
}

