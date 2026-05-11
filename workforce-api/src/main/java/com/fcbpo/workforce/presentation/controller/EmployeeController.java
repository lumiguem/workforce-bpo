package com.fcbpo.workforce.presentation.controller;

import com.fcbpo.workforce.application.dto.CreateEmployeeRequest;
import com.fcbpo.workforce.application.dto.EmployeeResponse;
import com.fcbpo.workforce.application.dto.UpdateEmployeeRequest;
import com.fcbpo.workforce.application.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request
    ) {

        return employeeService.createEmployee(request);
    }

    @GetMapping
    public List<EmployeeResponse> getAllEmployees() {

        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public EmployeeResponse getEmployeeById(
            @PathVariable("id") Integer id
    ) {

        return employeeService.getEmployeeById(id);
    }

    @PutMapping("/{id}")
    public EmployeeResponse updateEmployee(
            @PathVariable("id") Integer id,
            @Valid @RequestBody UpdateEmployeeRequest request
    ) {

        return employeeService.updateEmployee(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(
            @PathVariable("id") Integer id
    ) {

        employeeService.deleteEmployee(id);
    }
}
