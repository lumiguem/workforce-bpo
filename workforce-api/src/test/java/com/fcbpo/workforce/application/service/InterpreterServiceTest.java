package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.domain.model.Employee;
import com.fcbpo.workforce.domain.model.InterpreterDetails;
import com.fcbpo.workforce.domain.model.Role;
import com.fcbpo.workforce.domain.model.Wave;
import com.fcbpo.workforce.domain.model.WaveStage;
import com.fcbpo.workforce.domain.repository.EmployeeRepository;
import com.fcbpo.workforce.domain.repository.InterpreterDetailsRepository;
import com.fcbpo.workforce.domain.repository.RoleRepository;
import com.fcbpo.workforce.domain.repository.WaveRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class InterpreterServiceTest {

    @Test
    void listInterpreters_usesWaveStagesToExposeCurrentStage() {
        EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
        RoleRepository roleRepository = mock(RoleRepository.class);
        InterpreterDetailsRepository interpreterDetailsRepository = mock(InterpreterDetailsRepository.class);
        WaveRepository waveRepository = mock(WaveRepository.class);

        when(roleRepository.findByRoleName("Interpreter"))
                .thenReturn(Optional.of(Role.builder().roleId(1).roleName("Interpreter").build()));

        when(employeeRepository.findByRoleId(1)).thenReturn(List.of(
                Employee.builder()
                        .employeeId(10)
                        .firstName("Ana")
                        .lastName("Perez")
                        .companyEmail("ana@company.com")
                        .createdAt(LocalDateTime.now())
                        .roleId(1)
                        .build()
        ));

        when(interpreterDetailsRepository.findByWaveIdNotNull()).thenReturn(List.of(
                InterpreterDetails.builder()
                        .interpreterId(10)
                        .waveId(99)
                        .contractId(1)
                        .build()
        ));

        when(waveRepository.findById(99)).thenReturn(Optional.of(Wave.builder()
                .waveId(99)
                .waveName("Wave 99")
                .stages(List.of(
                        WaveStage.builder().stageName("TRAINING").startDate(LocalDate.now().minusDays(10)).endDate(LocalDate.now().minusDays(6)).build(),
                        WaveStage.builder().stageName("NESTING").startDate(LocalDate.now().minusDays(5)).endDate(LocalDate.now().minusDays(1)).build(),
                        WaveStage.builder().stageName("PRODUCTION").startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(30)).build()
                ))
                .build()));

        InterpreterService service = new InterpreterService(
                employeeRepository,
                roleRepository,
                interpreterDetailsRepository,
                waveRepository
        );

        List<?> result = service.listInterpreters();

        assertThat(result).hasSize(1);
        com.fcbpo.workforce.application.dto.InterpreterWithDetailsResponse response =
                (com.fcbpo.workforce.application.dto.InterpreterWithDetailsResponse) result.get(0);

        assertThat(response.getDetails().getWaveName()).isEqualTo("Wave 99");
        assertThat(response.getDetails().getCurrentStage()).isEqualTo("PRODUCTION");
    }

    @Test
    void listInterpreters_skipsInterpretersWithWaveWithoutStages() {
        EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
        RoleRepository roleRepository = mock(RoleRepository.class);
        InterpreterDetailsRepository interpreterDetailsRepository = mock(InterpreterDetailsRepository.class);
        WaveRepository waveRepository = mock(WaveRepository.class);

        when(roleRepository.findByRoleName("Interpreter"))
                .thenReturn(Optional.of(Role.builder().roleId(1).roleName("Interpreter").build()));

        when(employeeRepository.findByRoleId(1)).thenReturn(List.of(
                Employee.builder().employeeId(10).firstName("Ana").lastName("Perez").roleId(1).build()
        ));

        when(interpreterDetailsRepository.findByWaveIdNotNull()).thenReturn(List.of(
                InterpreterDetails.builder().interpreterId(10).waveId(99).contractId(1).build()
        ));

        when(waveRepository.findById(99)).thenReturn(Optional.of(Wave.builder()
                .waveId(99)
                .waveName("Wave 99")
                .stages(List.of())
                .build()));

        InterpreterService service = new InterpreterService(
                employeeRepository,
                roleRepository,
                interpreterDetailsRepository,
                waveRepository
        );

        assertThat(service.listInterpreters()).isEmpty();
    }
}
