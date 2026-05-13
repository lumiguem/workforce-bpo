package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.application.dto.LookupResponse;
import com.fcbpo.workforce.domain.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private final LanguageRepository languageRepository;

    public List<LookupResponse> getAllLanguages() {
        return languageRepository.findAll().stream()
                .map(language -> LookupResponse.builder()
                        .id(language.getLanguageId())
                        .name(language.getLanguageName())
                        .build())
                .toList();
    }
}
