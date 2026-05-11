package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.domain.model.Employee;
import com.fcbpo.workforce.domain.repository.EmployeeRepository;
import com.fcbpo.workforce.infrastructure.persistence.entity.CityEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.CountryEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.EmployeeEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.RoleEntity;
import com.fcbpo.workforce.infrastructure.persistence.entity.StatusEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class EmployeeRepositoryAdapter implements EmployeeRepository {

    private final EmployeeJpaRepository employeeJpaRepository;
    private final EntityManager entityManager;

    @Override
    public Employee save(Employee employee) {

        EmployeeEntity entity;
        if (employee.getEmployeeId() == null) {
            entity = new EmployeeEntity();
        } else {
            entity = employeeJpaRepository.findById(employee.getEmployeeId())
                    .orElseThrow(() -> new IllegalStateException("Employee not found: " + employee.getEmployeeId()));
        }

        entity.setFirstName(employee.getFirstName());
        entity.setLastName(employee.getLastName());
        entity.setCompanyEmail(employee.getCompanyEmail());
        entity.setPersonalEmail(employee.getPersonalEmail());
        entity.setPhoneNumber(employee.getPhoneNumber());
        entity.setRole(entityManager.getReference(RoleEntity.class, employee.getRoleId()));
        entity.setCity(employee.getCityId() == null ? null : entityManager.getReference(CityEntity.class, employee.getCityId()));
        entity.setCountry(employee.getCountryId() == null ? null : entityManager.getReference(CountryEntity.class, employee.getCountryId()));
        entity.setStatus(employee.getStatusId() == null ? null : entityManager.getReference(StatusEntity.class, employee.getStatusId()));
        entity.setManager(employee.getReportsTo() == null ? null : entityManager.getReference(EmployeeEntity.class, employee.getReportsTo()));

        EmployeeEntity saved = employeeJpaRepository.save(entity);

        return Employee.builder()
            .employeeId(saved.getEmployeeId())
                .firstName(saved.getFirstName())
                .lastName(saved.getLastName())
                .companyEmail(saved.getCompanyEmail())
                .personalEmail(saved.getPersonalEmail())
                .phoneNumber(saved.getPhoneNumber())
                .roleId(saved.getRole() == null ? null : saved.getRole().getRoleId())
                .roleName(saved.getRole() == null ? null : saved.getRole().getRoleName())
                .cityId(saved.getCity() == null ? null : saved.getCity().getCityId())
                .cityName(saved.getCity() == null ? null : saved.getCity().getCityName())
                .countryId(saved.getCountry() == null ? null : saved.getCountry().getCountryId())
                .countryName(saved.getCountry() == null ? null : saved.getCountry().getCountryName())
                .countryCode(saved.getCountry() == null ? null : saved.getCountry().getCountryCode())
                .statusId(saved.getStatus() == null ? null : saved.getStatus().getStatusId())
                .statusDescription(saved.getStatus() == null ? null : saved.getStatus().getDescription())
                .reportsTo(saved.getManager() == null ? null : saved.getManager().getEmployeeId())
                .reportsToName(saved.getManager() == null ? null : saved.getManager().getFirstName() + " " + saved.getManager().getLastName())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public Optional<Employee> findById(Integer id) {

        return employeeJpaRepository.findById(id)
                .map(this::toDomain);
    }

    @Override
    public List<Employee> findAll() {

        return employeeJpaRepository.findAll()
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public List<Employee> findByRoleId(Integer roleId) {
        return employeeJpaRepository.findByRole_RoleId(roleId)
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public void deleteById(Integer id) {
        employeeJpaRepository.deleteById(id);
    }

    @Override
    public Optional<Employee> findByCompanyEmail(String email) {
        return employeeJpaRepository.findByCompanyEmail(email)
                .map(this::toDomain);
    }

    private Employee toDomain(EmployeeEntity entity) {

        return Employee.builder()
                .employeeId(entity.getEmployeeId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .companyEmail(entity.getCompanyEmail())
                .personalEmail(entity.getPersonalEmail())
                .phoneNumber(entity.getPhoneNumber())
                .roleId(entity.getRole() == null ? null : entity.getRole().getRoleId())
                .roleName(entity.getRole() == null ? null : entity.getRole().getRoleName())
                .cityId(entity.getCity() == null ? null : entity.getCity().getCityId())
                .cityName(entity.getCity() == null ? null : entity.getCity().getCityName())
                .countryId(entity.getCountry() == null ? null : entity.getCountry().getCountryId())
                .countryName(entity.getCountry() == null ? null : entity.getCountry().getCountryName())
                .countryCode(entity.getCountry() == null ? null : entity.getCountry().getCountryCode())
                .statusId(entity.getStatus() == null ? null : entity.getStatus().getStatusId())
                .statusDescription(entity.getStatus() == null ? null : entity.getStatus().getDescription())
                .reportsTo(entity.getManager() == null ? null : entity.getManager().getEmployeeId())
                .reportsToName(entity.getManager() == null ? null : entity.getManager().getFirstName() + " " + entity.getManager().getLastName())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
