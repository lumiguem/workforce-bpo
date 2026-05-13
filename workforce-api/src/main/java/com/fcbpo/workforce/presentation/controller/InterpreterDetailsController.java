package com.fcbpo.workforce.presentation.controller;

import com.fcbpo.workforce.application.dto.InterpreterDetailsResponse;
import com.fcbpo.workforce.application.dto.UpsertInterpreterDetailsRequest;
import com.fcbpo.workforce.application.service.InterpreterDetailsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interpreters/{interpreterId}/details")
@RequiredArgsConstructor
public class InterpreterDetailsController {

    private final InterpreterDetailsService interpreterDetailsService;

    @GetMapping
    public InterpreterDetailsResponse getDetails(@PathVariable("interpreterId") Integer interpreterId) {
        return interpreterDetailsService.getDetails(interpreterId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InterpreterDetailsResponse createDetails(
            @PathVariable("interpreterId") Integer interpreterId,
            @Valid
            @RequestBody UpsertInterpreterDetailsRequest request
    ) {
        return interpreterDetailsService.createDetails(interpreterId, request);
    }

    @PutMapping
    public InterpreterDetailsResponse updateDetails(
            @PathVariable("interpreterId") Integer interpreterId,
            @Valid
            @RequestBody UpsertInterpreterDetailsRequest request
    ) {
        return interpreterDetailsService.updateDetails(interpreterId, request);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDetails(@PathVariable("interpreterId") Integer interpreterId) {
        interpreterDetailsService.deleteDetails(interpreterId);
    }
}
