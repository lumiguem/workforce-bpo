package com.fcbpo.workforce.presentation.controller;

import com.fcbpo.workforce.application.dto.LookupResponse;
import com.fcbpo.workforce.application.service.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/languages")
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping
    public List<LookupResponse> getAllLanguages() {
        return languageService.getAllLanguages();
    }
}
