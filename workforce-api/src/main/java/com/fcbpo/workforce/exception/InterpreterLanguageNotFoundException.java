package com.fcbpo.workforce.exception;

public class InterpreterLanguageNotFoundException extends RuntimeException {

    public InterpreterLanguageNotFoundException(Integer interpreterId, Integer languageId) {
        super("Interpreter language not found for interpreter " + interpreterId + " and language " + languageId);
    }
}
