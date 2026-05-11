package com.fcbpo.workforce.domain.repository;

import com.fcbpo.workforce.domain.model.Employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository {

    Employee save(Employee employee);

    Optional<Employee> findById(Integer id);

    List<Employee> findAll();

    List<Employee> findByRoleId(Integer roleId);

    void deleteById(Integer id);

    Optional<Employee> findByCompanyEmail(String email);
}
