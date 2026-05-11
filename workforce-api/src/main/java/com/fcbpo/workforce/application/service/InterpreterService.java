package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.application.dto.InterpreterWithDetailsResponse;
import com.fcbpo.workforce.domain.model.Employee;
import com.fcbpo.workforce.domain.repository.EmployeeRepository;
import com.fcbpo.workforce.domain.repository.InterpreterDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterpreterService {

    private static final int INTERPRETER_ROLE_ID = 1;

    private final EmployeeRepository employeeRepository;
    private final InterpreterDetailsRepository interpreterDetailsRepository;

    public List<InterpreterWithDetailsResponse> listInterpreters() {
        List<Employee> interpreters = employeeRepository.findByRoleId(INTERPRETER_ROLE_ID);

        Map<Integer, InterpreterWithDetailsResponse.Details> detailsByInterpreterId = interpreterDetailsRepository.findAll()
                .stream()
                .collect(java.util.stream.Collectors.toMap(
                        d -> d.getInterpreterId(),
                        d -> InterpreterWithDetailsResponse.Details.builder()
                                .interpreterId(d.getInterpreterId())
                                .waveId(d.getWaveId())
                                .contractId(d.getContractId())
                                .startDate(d.getStartDate())
                                .nestingDate(d.getNestingDate())
                                .productionStartDate(d.getProductionStartDate())
                                .build(),
                        (a, b) -> a
                ));

        return interpreters.stream()
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
                        .details(detailsByInterpreterId.get(emp.getEmployeeId()))
                        .build())
                .toList();
    }
}
