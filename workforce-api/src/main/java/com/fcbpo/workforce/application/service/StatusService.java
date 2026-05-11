package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.domain.model.Status;
import com.fcbpo.workforce.domain.repository.StatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatusService {
    private final StatusRepository statusRepository;

    public List<Status> getAllStatus() {
        return statusRepository.findAll();
    }
}
