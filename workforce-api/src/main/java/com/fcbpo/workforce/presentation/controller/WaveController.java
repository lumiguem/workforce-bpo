package com.fcbpo.workforce.presentation.controller;

import com.fcbpo.workforce.application.dto.WaveResponse;
import com.fcbpo.workforce.domain.model.Wave;
import com.fcbpo.workforce.application.service.WaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/waves")
@RequiredArgsConstructor
public class WaveController {
    private final WaveService waveService;

    @GetMapping
    public List<WaveResponse> getAllWaves() {
        return waveService.getAllWaves();
    }

    @GetMapping("/{id}")
    public WaveResponse getWaveById(@PathVariable Integer id) {
        return waveService.getWaveById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WaveResponse createWave(@RequestBody Wave wave) {
        return waveService.createWave(wave);
    }

    @PutMapping("/{id}")
    public WaveResponse updateWave(@PathVariable Integer id, @RequestBody Wave wave) {
        return waveService.updateWave(id, wave);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWave(@PathVariable Integer id) {
        waveService.deleteWave(id);
    }
}
