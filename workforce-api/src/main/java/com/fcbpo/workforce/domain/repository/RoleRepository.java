package com.fcbpo.workforce.domain.repository;

import com.fcbpo.workforce.domain.model.Role;
import java.util.List;
import java.util.Optional;

public interface RoleRepository {
    List<Role> findAll();
    Optional<Role> findById(Integer id);
    Optional<Role> findByRoleName(String roleName);
}
