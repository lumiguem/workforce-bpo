package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.application.dto.InterpreterDetailsResponse;
import com.fcbpo.workforce.application.dto.UpsertInterpreterDetailsRequest;
import com.fcbpo.workforce.domain.model.Employee;
import com.fcbpo.workforce.domain.model.InterpreterDetails;
import com.fcbpo.workforce.domain.repository.EmployeeRepository;
import com.fcbpo.workforce.domain.repository.InterpreterDetailsRepository;
import com.fcbpo.workforce.exception.InterpreterDetailsAlreadyExistsException;
import com.fcbpo.workforce.exception.InterpreterDetailsNotFoundException;
import com.fcbpo.workforce.exception.InterpreterNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InterpreterDetailsService {

    private static final int INTERPRETER_ROLE_ID = 1;

    private final EmployeeRepository employeeRepository;
    private final InterpreterDetailsRepository interpreterDetailsRepository;

    public InterpreterDetailsResponse getDetails(Integer interpreterId) {
        assertInterpreterExists(interpreterId);

        InterpreterDetails details = interpreterDetailsRepository.findByInterpreterId(interpreterId)
                .orElseThrow(() -> new InterpreterDetailsNotFoundException(interpreterId));

        return toResponse(details);
    }

    public InterpreterDetailsResponse createDetails(Integer interpreterId, UpsertInterpreterDetailsRequest request) {
        assertInterpreterExists(interpreterId);

        if (interpreterDetailsRepository.findByInterpreterId(interpreterId).isPresent()) {
            throw new InterpreterDetailsAlreadyExistsException(interpreterId);
        }

        InterpreterDetails saved = interpreterDetailsRepository.save(toDomain(interpreterId, request));
        return toResponse(saved);
    }

    public InterpreterDetailsResponse updateDetails(Integer interpreterId, UpsertInterpreterDetailsRequest request) {
        assertInterpreterExists(interpreterId);

        interpreterDetailsRepository.findByInterpreterId(interpreterId)
                .orElseThrow(() -> new InterpreterDetailsNotFoundException(interpreterId));

        InterpreterDetails saved = interpreterDetailsRepository.save(toDomain(interpreterId, request));
        return toResponse(saved);
    }

    public void deleteDetails(Integer interpreterId) {
        assertInterpreterExists(interpreterId);

        interpreterDetailsRepository.findByInterpreterId(interpreterId)
                .orElseThrow(() -> new InterpreterDetailsNotFoundException(interpreterId));

        interpreterDetailsRepository.deleteByInterpreterId(interpreterId);
    }

    private void assertInterpreterExists(Integer interpreterId) {
        Employee employee = employeeRepository.findById(interpreterId)
                .orElseThrow(() -> new InterpreterNotFoundException(interpreterId));

        if (employee.getRoleId() == null || employee.getRoleId() != INTERPRETER_ROLE_ID) {
            throw new InterpreterNotFoundException(interpreterId);
        }
    }

    private InterpreterDetails toDomain(Integer interpreterId, UpsertInterpreterDetailsRequest request) {
        return InterpreterDetails.builder()
                .interpreterId(interpreterId)
                .waveId(request.getWaveId())
                .contractId(request.getContractId())
                .startDate(request.getStartDate())
                .nestingDate(request.getNestingDate())
                .productionStartDate(request.getProductionStartDate())
                .build();
    }

    private InterpreterDetailsResponse toResponse(InterpreterDetails details) {
        return InterpreterDetailsResponse.builder()
                .interpreterId(details.getInterpreterId())
                .waveId(details.getWaveId())
                .contractId(details.getContractId())
                .startDate(details.getStartDate())
                .nestingDate(details.getNestingDate())
                .productionStartDate(details.getProductionStartDate())
                .build();
    }
}

