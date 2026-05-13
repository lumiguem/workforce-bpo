package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.application.dto.InterpreterDetailsResponse;
import com.fcbpo.workforce.application.dto.UpsertInterpreterDetailsRequest;
import com.fcbpo.workforce.domain.model.Employee;
import com.fcbpo.workforce.domain.model.InterpreterDetails;
import com.fcbpo.workforce.domain.repository.EmployeeRepository;
import com.fcbpo.workforce.domain.repository.InterpreterDetailsRepository;
import com.fcbpo.workforce.domain.repository.ContractRepository;
import com.fcbpo.workforce.domain.repository.WaveRepository;
import com.fcbpo.workforce.domain.repository.RoleRepository;
import com.fcbpo.workforce.exception.InterpreterDetailsAlreadyExistsException;
import com.fcbpo.workforce.exception.ContractNotFoundException;
import com.fcbpo.workforce.exception.InterpreterDetailsNotFoundException;
import com.fcbpo.workforce.exception.InterpreterNotFoundException;
import com.fcbpo.workforce.exception.WaveNotFoundException;
import com.fcbpo.workforce.exception.WaveStagesNotConfiguredException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InterpreterDetailsService {

    private static final String INTERPRETER_ROLE_NAME = "Interpreter";

    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final WaveRepository waveRepository;
    private final ContractRepository contractRepository;
    private final InterpreterDetailsRepository interpreterDetailsRepository;

    public InterpreterDetailsResponse getDetails(Integer interpreterId) {
        assertInterpreterExists(interpreterId);

        InterpreterDetails details = interpreterDetailsRepository.findByInterpreterId(interpreterId)
                .orElseThrow(() -> new InterpreterDetailsNotFoundException(interpreterId));

        return toResponse(details);
    }

    public InterpreterDetailsResponse createDetails(Integer interpreterId, UpsertInterpreterDetailsRequest request) {
        assertInterpreterExists(interpreterId);
        assertWaveIsConfigured(request.getWaveId());
        Integer contractId = resolveContractId(request.getContractId());
        assertContractExists(contractId);

        if (interpreterDetailsRepository.findByInterpreterId(interpreterId).isPresent()) {
            throw new InterpreterDetailsAlreadyExistsException(interpreterId);
        }

        InterpreterDetails saved = interpreterDetailsRepository.save(toDomain(interpreterId, request, contractId));
        return toResponse(saved);
    }

    public InterpreterDetailsResponse updateDetails(Integer interpreterId, UpsertInterpreterDetailsRequest request) {
        assertInterpreterExists(interpreterId);
        assertWaveIsConfigured(request.getWaveId());
        Integer contractId = resolveContractId(request.getContractId());
        assertContractExists(contractId);

        interpreterDetailsRepository.findByInterpreterId(interpreterId)
                .orElseThrow(() -> new InterpreterDetailsNotFoundException(interpreterId));

        InterpreterDetails saved = interpreterDetailsRepository.save(toDomain(interpreterId, request, contractId));
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

        Integer interpreterRoleId = roleRepository.findByRoleName(INTERPRETER_ROLE_NAME)
                .map(role -> role.getRoleId())
                .orElseThrow(() -> new IllegalStateException("Interpreter role is not configured"));

        if (employee.getRoleId() == null || !employee.getRoleId().equals(interpreterRoleId)) {
            throw new InterpreterNotFoundException(interpreterId);
        }
    }

    private void assertWaveIsConfigured(Integer waveId) {
        com.fcbpo.workforce.domain.model.Wave wave = waveRepository.findById(waveId)
                .orElseThrow(() -> new WaveNotFoundException(waveId));

        if (wave.getStages() == null || wave.getStages().isEmpty()) {
            throw new WaveStagesNotConfiguredException(waveId);
        }
    }

    private void assertContractExists(Integer contractId) {
        contractRepository.findById(contractId)
                .orElseThrow(() -> new ContractNotFoundException(contractId));
    }

    private Integer resolveContractId(Integer contractId) {
        return contractId == null ? 1 : contractId;
    }

    private InterpreterDetails toDomain(Integer interpreterId, UpsertInterpreterDetailsRequest request, Integer contractId) {
        return InterpreterDetails.builder()
                .interpreterId(interpreterId)
                .waveId(request.getWaveId())
                .contractId(contractId)
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
