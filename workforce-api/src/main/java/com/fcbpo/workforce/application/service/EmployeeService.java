package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.application.dto.CreateEmployeeRequest;
import com.fcbpo.workforce.application.dto.EmployeeResponse;
import com.fcbpo.workforce.application.dto.UpdateEmployeeRequest;
import com.fcbpo.workforce.application.mapper.EmployeeMapper;
import com.fcbpo.workforce.domain.model.Employee;
import com.fcbpo.workforce.domain.repository.EmployeeRepository;
import com.fcbpo.workforce.exception.EmployeeNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {

        Employee employee = employeeMapper.toDomain(request);

        Employee savedEmployee = employeeRepository.save(employee);

        return employeeMapper.toResponse(savedEmployee);
    }

    public List<EmployeeResponse> getAllEmployees() {

        return employeeMapper.toResponseList(employeeRepository.findAll());
    }

    public EmployeeResponse getEmployeeById(Integer id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(id));

        return employeeMapper.toResponse(employee);
    }

    public EmployeeResponse updateEmployee(Integer id, UpdateEmployeeRequest request) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));

        employeeMapper.updateDomain(request, employee);
        employee.setEmployeeId(id);

        Employee savedEmployee = employeeRepository.save(employee);

        return employeeMapper.toResponse(savedEmployee);
    }

    public void deleteEmployee(Integer id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));

        employeeRepository.deleteById(employee.getEmployeeId());
    }

}
