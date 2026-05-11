package com.fcbpo.workforce.presentation.controller;

import com.fcbpo.workforce.domain.model.Status;
import com.fcbpo.workforce.application.service.StatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/status")
@RequiredArgsConstructor
public class StatusController {
    private final StatusService statusService;

    @GetMapping
    public List<Status> getAllStatus() {
        return statusService.getAllStatus();
    }
}
