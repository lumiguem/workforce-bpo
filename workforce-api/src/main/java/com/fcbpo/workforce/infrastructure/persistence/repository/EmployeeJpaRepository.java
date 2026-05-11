package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.infrastructure.persistence.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeJpaRepository extends JpaRepository<EmployeeEntity, Integer> {

    Optional<EmployeeEntity> findByCompanyEmail(String companyEmail);

    java.util.List<EmployeeEntity> findByRole_RoleId(Integer roleId);
}
