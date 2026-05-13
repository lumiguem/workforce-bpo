package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.application.dto.CreateInterpreterSetupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterpreterSetupService {

    private final InterpreterDetailsService interpreterDetailsService;
    private final InterpreterLanguageService interpreterLanguageService;

    @Transactional
    public void createInterpreterSetup(Integer interpreterId, CreateInterpreterSetupRequest request) {
        interpreterLanguageService.createInterpreterLanguage(interpreterId, toLanguageRequest(request));
        interpreterDetailsService.createDetails(interpreterId, toDetailsRequest(request));
    }

    private com.fcbpo.workforce.application.dto.UpsertInterpreterLanguageRequest toLanguageRequest(CreateInterpreterSetupRequest request) {
        com.fcbpo.workforce.application.dto.UpsertInterpreterLanguageRequest languageRequest =
                new com.fcbpo.workforce.application.dto.UpsertInterpreterLanguageRequest();
        languageRequest.setLanguageId(request.getLanguageId());
        return languageRequest;
    }

    private com.fcbpo.workforce.application.dto.UpsertInterpreterDetailsRequest toDetailsRequest(CreateInterpreterSetupRequest request) {
        com.fcbpo.workforce.application.dto.UpsertInterpreterDetailsRequest detailsRequest =
                new com.fcbpo.workforce.application.dto.UpsertInterpreterDetailsRequest();
        detailsRequest.setWaveId(request.getWaveId());
        detailsRequest.setContractId(request.getContractId() == null ? 1 : request.getContractId());
        detailsRequest.setStartDate(request.getStartDate());
        detailsRequest.setNestingDate(request.getNestingDate());
        detailsRequest.setProductionStartDate(request.getProductionStartDate());
        return detailsRequest;
    }
}
