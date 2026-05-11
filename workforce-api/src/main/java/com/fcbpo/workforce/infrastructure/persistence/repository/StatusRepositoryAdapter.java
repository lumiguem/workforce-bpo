package com.fcbpo.workforce.infrastructure.persistence.repository;

import com.fcbpo.workforce.domain.model.Status;
import com.fcbpo.workforce.domain.repository.StatusRepository;
import com.fcbpo.workforce.infrastructure.persistence.entity.StatusEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class StatusRepositoryAdapter implements StatusRepository {
    private final StatusJpaRepository statusJpaRepository;

    @Override
    public List<Status> findAll() {
        return statusJpaRepository.findAll().stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Status> findById(Integer id) {
        return statusJpaRepository.findById(id).map(this::toDomain);
    }

    private Status toDomain(StatusEntity entity) {
        return Status.builder()
                .statusId(entity.getStatusId())
                .description(entity.getDescription())
                .build();
    }
}
