package com.fcbpo.workforce.presentation.controller;

import com.fcbpo.workforce.application.dto.CreateInterpreterSetupRequest;
import com.fcbpo.workforce.application.service.InterpreterSetupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/interpreters")
@RequiredArgsConstructor
public class InterpreterSetupController {

    private final InterpreterSetupService interpreterSetupService;

    @PostMapping("/{interpreterId}/setup")
    @ResponseStatus(HttpStatus.CREATED)
    public void createInterpreterSetup(
            @PathVariable Integer interpreterId,
            @Valid @RequestBody CreateInterpreterSetupRequest request
    ) {
        interpreterSetupService.createInterpreterSetup(interpreterId, request);
    }
}
