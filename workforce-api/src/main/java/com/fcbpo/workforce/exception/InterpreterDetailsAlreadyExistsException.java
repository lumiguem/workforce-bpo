package com.fcbpo.workforce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class InterpreterDetailsAlreadyExistsException extends RuntimeException {

    public InterpreterDetailsAlreadyExistsException(Integer interpreterId) {
        super("Interpreter details already exists for interpreter: " + interpreterId);
    }
}

