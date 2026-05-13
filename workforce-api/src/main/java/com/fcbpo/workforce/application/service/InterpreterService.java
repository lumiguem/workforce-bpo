package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.application.dto.InterpreterWithDetailsResponse;
import com.fcbpo.workforce.domain.model.Employee;
import com.fcbpo.workforce.domain.model.InterpreterDetails;
import com.fcbpo.workforce.domain.model.Wave;
import com.fcbpo.workforce.domain.model.WaveStage;
import com.fcbpo.workforce.domain.repository.EmployeeRepository;
import com.fcbpo.workforce.domain.repository.InterpreterDetailsRepository;
import com.fcbpo.workforce.domain.repository.RoleRepository;
import com.fcbpo.workforce.domain.repository.WaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterpreterService {

    private static final String INTERPRETER_ROLE_NAME = "Interpreter";

    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final InterpreterDetailsRepository interpreterDetailsRepository;
    private final WaveRepository waveRepository;

    public List<InterpreterWithDetailsResponse> listInterpreters() {
        Integer interpreterRoleId = roleRepository.findByRoleName(INTERPRETER_ROLE_NAME)
                .map(role -> role.getRoleId())
                .orElseThrow(() -> new IllegalStateException("Interpreter role is not configured"));

        List<Employee> interpreters = employeeRepository.findByRoleId(interpreterRoleId);

        Map<Integer, InterpreterDetails> detailsByInterpreterId = interpreterDetailsRepository.findByWaveIdNotNull()
                .stream()
                .collect(Collectors.toMap(
                        InterpreterDetails::getInterpreterId,
                        d -> d,
                        (a, b) -> a
                ));

        return interpreters.stream()
                .map(emp -> {
                    InterpreterDetails details = detailsByInterpreterId.get(emp.getEmployeeId());
                    if (details == null) {
                        return null;
                    }

                    InterpreterWithDetailsResponse.Details detailsResponse = toDetailsResponse(details);
                    if (detailsResponse == null) {
                        return null;
                    }

                    return InterpreterWithDetailsResponse.builder()
                        .employeeId(emp.getEmployeeId())
                        .firstName(emp.getFirstName())
                        .lastName(emp.getLastName())
                        .companyEmail(emp.getCompanyEmail())
                        .personalEmail(emp.getPersonalEmail())
                        .phoneNumber(emp.getPhoneNumber())
                        .roleId(emp.getRoleId())
                        .cityId(emp.getCityId())
                        .countryId(emp.getCountryId())
                        .statusId(emp.getStatusId())
                        .reportsTo(emp.getReportsTo())
                        .createdAt(emp.getCreatedAt())
                        .details(detailsResponse)
                        .build();
                })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    private InterpreterWithDetailsResponse.Details toDetailsResponse(InterpreterDetails details) {
        Wave wave = waveRepository.findById(details.getWaveId()).orElse(null);
        if (wave == null || wave.getStages() == null || wave.getStages().isEmpty()) {
            return null;
        }

        return InterpreterWithDetailsResponse.Details.builder()
                .interpreterId(details.getInterpreterId())
                .waveId(details.getWaveId())
                .waveName(wave == null ? null : wave.getWaveName())
                .contractId(details.getContractId())
                .startDate(details.getStartDate())
                .nestingDate(details.getNestingDate())
                .productionStartDate(details.getProductionStartDate())
                .currentStage(resolveCurrentStage(wave))
                .build();
    }

    private String resolveCurrentStage(Wave wave) {
        LocalDate today = LocalDate.now();
        List<WaveStage> stages = wave.getStages().stream()
                .filter(stage -> stage.getStartDate() != null)
                .sorted(Comparator.comparing(WaveStage::getStartDate))
                .toList();

        for (WaveStage stage : stages) {
            if (stage.getStartDate() == null) {
                continue;
            }

            boolean startsOnTime = !today.isBefore(stage.getStartDate());
            boolean endsOnTime = stage.getEndDate() == null || !today.isAfter(stage.getEndDate());
            if (startsOnTime && endsOnTime) {
                return stage.getStageName();
            }
        }

        WaveStage firstStage = stages.isEmpty() ? null : stages.get(0);
        if (firstStage == null) {
            return null;
        }

        WaveStage lastStage = stages.stream()
                .filter(stage -> stage.getEndDate() != null)
                .reduce((a, b) -> b)
                .orElse(firstStage);

        if (today.isBefore(firstStage.getStartDate())) {
            return "UPCOMING";
        }

        if (lastStage.getEndDate() != null && today.isAfter(lastStage.getEndDate())) {
            return "COMPLETED";
        }

        return null;
    }
}
