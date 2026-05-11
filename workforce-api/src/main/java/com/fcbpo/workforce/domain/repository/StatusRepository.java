package com.fcbpo.workforce.domain.repository;

import com.fcbpo.workforce.domain.model.Status;
import java.util.List;
import java.util.Optional;

public interface StatusRepository {
    List<Status> findAll();
    Optional<Status> findById(Integer id);
}
