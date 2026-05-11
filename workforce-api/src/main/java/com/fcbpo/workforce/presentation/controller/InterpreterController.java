package com.fcbpo.workforce.presentation.controller;

import com.fcbpo.workforce.application.dto.InterpreterWithDetailsResponse;
import com.fcbpo.workforce.application.service.InterpreterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/interpreters")
@RequiredArgsConstructor
public class InterpreterController {

    private final InterpreterService interpreterService;

    @GetMapping
    public List<InterpreterWithDetailsResponse> listInterpreters() {
        return interpreterService.listInterpreters();
    }
}

