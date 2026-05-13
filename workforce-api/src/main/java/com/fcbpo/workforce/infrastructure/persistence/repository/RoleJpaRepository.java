package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.infrastructure.persistence.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleJpaRepository extends JpaRepository<RoleEntity, Integer> {
    java.util.Optional<RoleEntity> findByRoleName(String roleName);
}
