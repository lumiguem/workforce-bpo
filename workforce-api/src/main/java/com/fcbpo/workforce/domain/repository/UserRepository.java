package com.fcbpo.workforce.domain.repository;

import com.fcbpo.workforce.domain.model.User;

import java.util.Optional;

public interface UserRepository {

    User save(User user);

    Optional<User> findByEmail(String email);
}