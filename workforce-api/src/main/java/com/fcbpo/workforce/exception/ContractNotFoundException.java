package com.fcbpo.workforce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ContractNotFoundException extends RuntimeException {

    public ContractNotFoundException(Integer contractId) {
        super("Contract not found: " + contractId);
    }
}
