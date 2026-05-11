package com.fcbpo.workforce.infrastructure.persistence.adapter;

import com.fcbpo.workforce.domain.model.User;
import com.fcbpo.workforce.domain.repository.UserRepository;
import com.fcbpo.workforce.infrastructure.persistence.entity.UserEntity;
import com.fcbpo.workforce.infrastructure.persistence.repository.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepository {

    private final JpaUserRepository jpaRepository;

    @Override
    public User save(User user) {
        UserEntity entity = mapToEntity(user);
        return mapToDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email)
                .map(this::mapToDomain);
    }

    private User mapToDomain(UserEntity entity) {
        return User.builder()
                .id(entity.getUserId())
                .email(entity.getEmail())
                .password(entity.getPassword())
                .role(entity.getRole())
                .employeeId(entity.getEmployeeId())
                .build();
    }

    private UserEntity mapToEntity(User user) {
        return UserEntity.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole())
                .employeeId(user.getEmployeeId())
                .build();
    }
}