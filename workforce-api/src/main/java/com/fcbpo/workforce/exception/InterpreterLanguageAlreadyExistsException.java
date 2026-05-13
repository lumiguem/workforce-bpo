package com.fcbpo.workforce.exception;

public class InterpreterLanguageAlreadyExistsException extends RuntimeException {

    public InterpreterLanguageAlreadyExistsException(Integer interpreterId, Integer languageId) {
        super("Interpreter language already exists for interpreter " + interpreterId + " and language " + languageId);
    }
}
