package com.fcbpo.workforce.exception;

public class LanguageNotFoundException extends RuntimeException {

    public LanguageNotFoundException(Integer languageId) {
        super("Language not found with id " + languageId);
    }
}
