package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.domain.model.Role;
import com.fcbpo.workforce.domain.repository.RoleRepository;
import com.fcbpo.workforce.infrastructure.persistence.entity.RoleEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RoleRepositoryAdapter implements RoleRepository {
    private final RoleJpaRepository roleJpaRepository;

    @Override
    public List<Role> findAll() {
        return roleJpaRepository.findAll().stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Role> findById(Integer id) {
        return roleJpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Role> findByRoleName(String roleName) {
        return roleJpaRepository.findByRoleName(roleName).map(this::toDomain);
    }

    private Role toDomain(RoleEntity entity) {
        return Role.builder()
                .roleId(entity.getRoleId())
                .roleName(entity.getRoleName())
                .build();
    }
}
