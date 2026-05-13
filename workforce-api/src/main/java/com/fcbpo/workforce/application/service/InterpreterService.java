package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.application.dto.InterpreterWithDetailsResponse;
import com.fcbpo.workforce.domain.model.Employee;
import com.fcbpo.workforce.domain.model.InterpreterDetails;
import com.fcbpo.workforce.domain.repository.EmployeeRepository;
import com.fcbpo.workforce.domain.repository.InterpreterDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterpreterService {

    private static final int INTERPRETER_ROLE_ID = 1;

    private final EmployeeRepository employeeRepository;
    private final InterpreterDetailsRepository interpreterDetailsRepository;

    public List<InterpreterWithDetailsResponse> listInterpreters() {
        List<Employee> interpreters = employeeRepository.findByRoleId(INTERPRETER_ROLE_ID);

        Map<Integer, InterpreterDetails> detailsByInterpreterId = interpreterDetailsRepository.findByWaveIdNotNull()
                .stream()
                .collect(Collectors.toMap(
                        InterpreterDetails::getInterpreterId,
                        d -> d,
                        (a, b) -> a
                ));

        return interpreters.stream()
                .filter(emp -> detailsByInterpreterId.containsKey(emp.getEmployeeId()))
                .map(emp -> InterpreterWithDetailsResponse.builder()
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
                        .details(toDetailsResponse(detailsByInterpreterId.get(emp.getEmployeeId())))
                        .build())
                .toList();
    }

    private InterpreterWithDetailsResponse.Details toDetailsResponse(InterpreterDetails details) {
        return InterpreterWithDetailsResponse.Details.builder()
                .interpreterId(details.getInterpreterId())
                .waveId(details.getWaveId())
                .contractId(details.getContractId())
                .startDate(details.getStartDate())
                .nestingDate(details.getNestingDate())
                .productionStartDate(details.getProductionStartDate())
                .build();
    }
}
