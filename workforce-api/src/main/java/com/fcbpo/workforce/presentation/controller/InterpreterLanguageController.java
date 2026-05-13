package com.fcbpo.workforce.presentation.controller;

import com.fcbpo.workforce.application.dto.InterpreterLanguageResponse;
import com.fcbpo.workforce.application.dto.UpsertInterpreterLanguageRequest;
import com.fcbpo.workforce.application.service.InterpreterLanguageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interpreter-languages")
@RequiredArgsConstructor
public class InterpreterLanguageController {

    private final InterpreterLanguageService interpreterLanguageService;

    @GetMapping
    public List<InterpreterLanguageResponse> getAllInterpreterLanguages() {
        return interpreterLanguageService.getAllInterpreterLanguages();
    }

    @GetMapping("/{interpreterId}/{languageId}")
    public InterpreterLanguageResponse getInterpreterLanguage(
            @PathVariable Integer interpreterId,
            @PathVariable Integer languageId
    ) {
        return interpreterLanguageService.getInterpreterLanguage(interpreterId, languageId);
    }

    @PostMapping("/{interpreterId}")
    @ResponseStatus(HttpStatus.CREATED)
    public InterpreterLanguageResponse createInterpreterLanguage(
            @PathVariable Integer interpreterId,
            @Valid @RequestBody UpsertInterpreterLanguageRequest request
    ) {
        return interpreterLanguageService.createInterpreterLanguage(interpreterId, request);
    }

    @PutMapping("/{interpreterId}/{languageId}")
    public InterpreterLanguageResponse updateInterpreterLanguage(
            @PathVariable Integer interpreterId,
            @PathVariable Integer languageId,
            @Valid @RequestBody UpsertInterpreterLanguageRequest request
    ) {
        return interpreterLanguageService.updateInterpreterLanguage(interpreterId, languageId, request);
    }

    @DeleteMapping("/{interpreterId}/{languageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInterpreterLanguage(
            @PathVariable Integer interpreterId,
            @PathVariable Integer languageId
    ) {
        interpreterLanguageService.deleteInterpreterLanguage(interpreterId, languageId);
    }
}
