package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.application.dto.InterpreterLanguageResponse;
import com.fcbpo.workforce.application.dto.UpsertInterpreterLanguageRequest;
import com.fcbpo.workforce.domain.model.Employee;
import com.fcbpo.workforce.domain.model.InterpreterLanguage;
import com.fcbpo.workforce.domain.repository.EmployeeRepository;
import com.fcbpo.workforce.domain.repository.InterpreterLanguageRepository;
import com.fcbpo.workforce.domain.repository.LanguageRepository;
import com.fcbpo.workforce.exception.InterpreterLanguageAlreadyExistsException;
import com.fcbpo.workforce.exception.InterpreterLanguageNotFoundException;
import com.fcbpo.workforce.exception.InterpreterNotFoundException;
import com.fcbpo.workforce.exception.LanguageNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterpreterLanguageService {

    private static final int INTERPRETER_ROLE_ID = 1;

    private final EmployeeRepository employeeRepository;
    private final LanguageRepository languageRepository;
    private final InterpreterLanguageRepository interpreterLanguageRepository;

    public List<InterpreterLanguageResponse> getAllInterpreterLanguages() {
        return interpreterLanguageRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public InterpreterLanguageResponse getInterpreterLanguage(Integer interpreterId, Integer languageId) {
        assertInterpreterExists(interpreterId);
        assertLanguageExists(languageId);

        InterpreterLanguage interpreterLanguage = interpreterLanguageRepository.findByInterpreterIdAndLanguageId(interpreterId, languageId)
                .orElseThrow(() -> new InterpreterLanguageNotFoundException(interpreterId, languageId));

        return toResponse(interpreterLanguage);
    }

    public InterpreterLanguageResponse createInterpreterLanguage(Integer interpreterId, UpsertInterpreterLanguageRequest request) {
        assertInterpreterExists(interpreterId);
        assertLanguageExists(request.getLanguageId());

        if (interpreterLanguageRepository.findByInterpreterIdAndLanguageId(interpreterId, request.getLanguageId()).isPresent()) {
            throw new InterpreterLanguageAlreadyExistsException(interpreterId, request.getLanguageId());
        }

        InterpreterLanguage saved = interpreterLanguageRepository.save(InterpreterLanguage.builder()
                .interpreterId(interpreterId)
                .languageId(request.getLanguageId())
                .build());

        return toResponse(saved);
    }

    public InterpreterLanguageResponse updateInterpreterLanguage(Integer interpreterId, Integer languageId, UpsertInterpreterLanguageRequest request) {
        assertInterpreterExists(interpreterId);
        assertLanguageExists(request.getLanguageId());

        interpreterLanguageRepository.findByInterpreterIdAndLanguageId(interpreterId, languageId)
                .orElseThrow(() -> new InterpreterLanguageNotFoundException(interpreterId, languageId));

        if (!languageId.equals(request.getLanguageId())) {
            interpreterLanguageRepository.deleteByInterpreterIdAndLanguageId(interpreterId, languageId);
        }

        InterpreterLanguage saved = interpreterLanguageRepository.save(InterpreterLanguage.builder()
                .interpreterId(interpreterId)
                .languageId(request.getLanguageId())
                .build());

        return toResponse(saved);
    }

    public void deleteInterpreterLanguage(Integer interpreterId, Integer languageId) {
        assertInterpreterExists(interpreterId);
        assertLanguageExists(languageId);

        interpreterLanguageRepository.findByInterpreterIdAndLanguageId(interpreterId, languageId)
                .orElseThrow(() -> new InterpreterLanguageNotFoundException(interpreterId, languageId));

        interpreterLanguageRepository.deleteByInterpreterIdAndLanguageId(interpreterId, languageId);
    }

    private void assertInterpreterExists(Integer interpreterId) {
        Employee employee = employeeRepository.findById(interpreterId)
                .orElseThrow(() -> new InterpreterNotFoundException(interpreterId));

        if (employee.getRoleId() == null || employee.getRoleId() != INTERPRETER_ROLE_ID) {
            throw new InterpreterNotFoundException(interpreterId);
        }
    }

    private void assertLanguageExists(Integer languageId) {
        languageRepository.findById(languageId)
                .orElseThrow(() -> new LanguageNotFoundException(languageId));
    }

    private InterpreterLanguageResponse toResponse(InterpreterLanguage interpreterLanguage) {
        return InterpreterLanguageResponse.builder()
                .interpreterId(interpreterLanguage.getInterpreterId())
                .languageId(interpreterLanguage.getLanguageId())
                .build();
    }
}
